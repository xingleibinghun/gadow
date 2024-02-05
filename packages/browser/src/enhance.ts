/**
 * 增强底层函数 - 触发事件发布器，传入处理后的数据
 */
import { EventTypes } from '@gadow/types'
import { global, enhance } from '@gadow/utils'
import { getEventEmitter } from '@gadow/core'
import {
  throttled,
  needIgnoreUrl,
  isResourceLoadedError
} from './utils'

/* ========== 异常 ========== */

/**
 * error
 */
const enhanceErrorListener = () => {
  global.addEventListener(
    'error',
    e => {
      // e 的数据类型：EventError、throw 抛出的具体数据类型
      if (!isResourceLoadedError(e)) {
        getEventEmitter().emit(EventTypes.Error, e)
      }
    },
    true
  )
}

/**
 * resource
 */
const enhanceResourceListener = () => {
  global.addEventListener(
    'error',
    e => {
      if (isResourceLoadedError(e)) {
        getEventEmitter().emit(EventTypes.Resource, e)
      }
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
    getEventEmitter().emit(EventTypes.Unhandledrejection, e)
  })
}

/**
 * xhr
 */
const enhanceXhr = () => {
  enhance(XMLHttpRequest.prototype, 'open', (origin: any) => {
    return function (...args: any[]): void {
      try {
        // @ts-ignore
        this.__requestInfo = {
          method: args[0],
          url: args[1],
          headers: {}
        }
      } catch (err) {
        console.error(
          'Running the overridden XMLHttpRequest.prototype.open method failed',
          err
        )
      }
      // @ts-ignore
      origin.apply(this, args)
    }
  })
  enhance(XMLHttpRequest.prototype, 'setRequestHeader', (origin: any) => {
    // @ts-ignore
    return function (headers, value): void {
      try {
        // @ts-ignore
        this.__requestInfo.headers[headers] = value
      } catch (err) {
        console.error(
          'Running the overridden XMLHttpRequest.prototype.setRequestHeader method failed',
          err
        )
      }
      // @ts-ignore
      origin.call(this, headers, value)
    }
  })
  enhance(XMLHttpRequest.prototype, 'send', (origin: any) => {
    // @ts-ignore
    return function (body): void {
      try {
        // @ts-ignore
        if (!needIgnoreUrl(this.__requestInfo.url)) {
          // @ts-ignore
          this.addEventListener(
            'loadend',
            function (progressEvent: ProgressEvent) {
              const { target } = progressEvent
              const { response, status } = target as any
              // @ts-ignore
              const requestInfo = this.__requestInfo
              const ok = 200 <= status && status <= 299
              getEventEmitter().emit(EventTypes.Xhr, {
                url: requestInfo.url,
                method: requestInfo.method,
                headers: requestInfo.headers,
                body,
                ok,
                status,
                response
              })
            }
          )
        }
      } catch (err) {
        console.error(
          'Running the overridden XMLHttpRequest.prototype.send method failed',
          err
        )
      }
      // @ts-ignore
      origin.call(this, body)
    }
  })
}

/**
 * fetch
 */
const enhanceFetch = () => {
  enhance(global, 'fetch', (origin: any) => {
    return (
      input: string | Request,
      init: {
        method?: string
        headers?: {}
        body?: unknown
        mode?: string
      } = {}
    ) => {
      const promise: Promise<Response> = origin(input, init)
      try {
        promise
          .then(response => {
            const url = input instanceof Request ? input.url : input
            if (needIgnoreUrl(url)) return
            response
              .clone()
              .text()
              .then((text: string) => {
                getEventEmitter().emit(EventTypes.Fetch, {
                  url,
                  method: init.method || 'GET',
                  headers: init.headers || {},
                  body: init.body,
                  ok: response.ok,
                  status: response.status,
                  isResolve: true,
                  response: text
                })
              })
          })
          .catch((rejectReason: any) => {
            const url = input instanceof Request ? input.url : input
            if (needIgnoreUrl(url)) return
            getEventEmitter().emit(EventTypes.Fetch, {
              url,
              method: init.method || 'GET',
              headers: init.headers || {},
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
    getEventEmitter().emit(EventTypes.History, {
      from,
      to
    })

    // @ts-ignore
    originOnpopstate && originOnpopstate(event)
  }

  const enhanceHistoryFn = (origin: any) => {
    return function (...args: any[]) {
      const to = args.length === 3 ? args[2] : undefined
      const from = prev
      prev = to
      getEventEmitter().emit(EventTypes.History, {
        from,
        to
      })

      // @ts-ignore
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
    getEventEmitter().emit(EventTypes.Hashchange, e)
  })
}

/**
 * click
 */
const enhanceClick = () => {
  if (!('document' in global)) return

  const onClick = throttled((e: Event) => {
    getEventEmitter().emit(EventTypes.Click, e)
  })
  global.document.addEventListener('click', onClick)
}

/* ========== 用户行为 - end ========== */

export const enhanceMap = {
  [EventTypes.Error]: enhanceErrorListener,
  [EventTypes.Resource]: enhanceResourceListener,
  [EventTypes.Unhandledrejection]: enhanceUnhandledrejectionListener,
  [EventTypes.Xhr]: enhanceXhr,
  [EventTypes.Fetch]: enhanceFetch,
  [EventTypes.History]: enhanceHistory,
  [EventTypes.Hashchange]: enhanceHashchange,
  [EventTypes.Click]: enhanceClick
}
