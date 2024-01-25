/**
 * 增强底层函数 - 触发事件发布器，传入处理后的数据
 */
import { ExceptionTypes, BreadcrumbTypes, throttled } from '@sohey/shared'
import { global, needIgnoreUrl } from '../utils'
import { eventEmitter } from '../event'

const enhance = (source, prop, enhancedFn) => {
  if (!source || !(prop in source) || typeof source[prop] !== 'function') return
  source[prop] = enhancedFn(source[prop])
}

/* ========== 异常 ========== */

/**
 * error
 */
const enhanceErrorListener = () => {
  global.addEventListener(
    'error',
    e => {
      // e 的数据类型：EventError、throw 抛出的具体数据类型
      const isResourceLoadedError =
        e instanceof Event &&
        (e.target instanceof HTMLScriptElement ||
          e.target instanceof HTMLLinkElement ||
          e.target instanceof HTMLImageElement)
      const event = isResourceLoadedError
        ? ExceptionTypes.Resource
        : ExceptionTypes.Error
      eventEmitter.emit(event, e)
    },
    true
  )
}

/**
 * unhandledrejection
 *  reject 了但没有处理函数、回调函数运行出错
 */
const enhanceUnhandledrejectionListener = () => {
  global.addEventListener('unhandledrejection', e => {
    eventEmitter.emit(ExceptionTypes.Unhandledrejection, e)
  })
}

/**
 * xhr
 */
const enhanceXhr = () => {
  enhance(XMLHttpRequest.prototype, 'open', origin => {
    return function (...args) {
      try {
        this.__requestInfo = {
          method: args[0],
          url: args[1],
          header: {}
        }
      } catch (err) {
        console.error(
          'Running the overridden XMLHttpRequest.prototype.open method failed',
          err
        )
      }
      origin.apply(this, args)
    }
  })
  enhance(XMLHttpRequest.prototype, 'setRequestHeader', origin => {
    return function (header, value) {
      try {
        this.__requestInfo.header[header] = value
      } catch (err) {
        console.error(
          'Running the overridden XMLHttpRequest.prototype.setRequestHeader method failed',
          err
        )
      }
      origin.call(this, header, value)
    }
  })
  enhance(XMLHttpRequest.prototype, 'send', origin => {
    return function (body) {
      try {
        if (!needIgnoreUrl(this.__requestInfo.url)) {
          this.addEventListener('loadend', function (progressEvent) {
            const { target } = progressEvent
            const { response, status } = target
            const requestInfo = this.__requestInfo
            const ok = 200 <= status && status <= 299
            eventEmitter.emit(ExceptionTypes.Xhr, {
              url: requestInfo.url,
              method: requestInfo.method,
              header: requestInfo.header,
              body,
              ok,
              status,
              response
            })
          })
        }
      } catch (err) {
        console.error(
          'Running the overridden XMLHttpRequest.prototype.send method failed',
          err
        )
      }
      origin.call(this, body)
    }
  })
}

/**
 * fetch
 */
const enhanceFetch = () => {
  enhance(global, 'fetch', origin => {
    return (input, init) => {
      const promise = origin(input, init)
      try {
        promise
          .then(response => {
            const url = input instanceof Request ? input.url : input
            if (needIgnoreUrl(url)) return
            response
              .clone()
              .text()
              .then(text => {
                eventEmitter.emit(ExceptionTypes.Fetch, {
                  url,
                  method: init.method || 'GET',
                  header: init.header || {},
                  body: init.body,
                  ok: response.ok,
                  status: response.status,
                  isResolve: true,
                  response: text
                })
              })
          })
          .catch(rejectReason => {
            const url = input instanceof Request ? input.url : input
            if (needIgnoreUrl(url)) return
            eventEmitter.emit(ExceptionTypes.Fetch, {
              url,
              method: init.method || 'GET',
              header: init.header || {},
              body: init.body,
              ok: false,
              status: 0,
              isResolve: false,
              rejectReason
            })
          })
      } catch (err) {
        console.error('Running the overridden fetch method failed', err)
      }
      return promise
    }
  })
}

/* ========== 异常 - end ========== */

/* ========== 用户行为 ========== */

/**
 * history
 *  TODO 传入路由配置模式，按需 enhance
 */
const enhanceHistory = () => {
  if (!('history' in global)) return

  let prev = location.href.slice(location.origin.length)
  const originOnpopstate = global.onpopstate
  global.onpopstate = event => {
    const from = prev
    const to = location.href.slice(location.origin.length)
    prev = to
    eventEmitter.emit(BreadcrumbTypes.History, {
      from,
      to
    })

    originOnpopstate && originOnpopstate(event)
  }

  const enhanceHistoryFn = origin => {
    return function (...args) {
      const to = args.length === 3 ? args[2] : undefined
      const from = prev
      prev = to
      eventEmitter.emit(BreadcrumbTypes.History, {
        from,
        to
      })

      return origin.apply(this, args)
    }
  }
  enhance(global.history, 'pushState', enhanceHistoryFn)
  enhance(global.history, 'replaceState', enhanceHistoryFn)
}

/**
 * hashchange
 *  TODO 传入路由配置模式，按需 enhance
 */
const enhanceHashchange = () => {
  if (!('onhashchange' in global)) return

  global.addEventListener('hashchange', (e: HashChangeEvent) => {
    eventEmitter.emit(BreadcrumbTypes.Hashchange, e)
  })
}

/**
 * click
 */
const enhanceClick = () => {
  if (!('document' in global)) return

  const onClick = throttled(e => {
    eventEmitter.emit(BreadcrumbTypes.Click, e)
  })
  global.document.addEventListener('click', onClick)
}

/* ========== 用户行为 - end ========== */

export const enhanceInit = () => {
  /* 异常 */
  enhanceErrorListener()
  enhanceUnhandledrejectionListener()
  enhanceXhr()
  enhanceFetch()

  /* 用户行为 */
  enhanceHistory()
  enhanceHashchange()
  enhanceClick()
}
