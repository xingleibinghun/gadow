/**
 * 增强底层函数 - 触发事件发布器，传入处理后的数据
 */
import { EventTypes } from '@sohey/shared'
import { global, needIgnoreUrl } from '../utils'
import { eventEmitter } from './event'

const enhance = (source, prop, enhanceFn) => {
  if (!source || !(prop in source) || typeof source[prop] !== 'function') return
  source[prop] = enhanceFn(source[prop])
}

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
        ? EventTypes.Resource
        : EventTypes.Error
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
    eventEmitter.emit(EventTypes.Unhandledrejection, e)
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
            eventEmitter.emit(EventTypes.Xhr, {
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
                eventEmitter.emit(EventTypes.Fetch, {
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
            eventEmitter.emit(EventTypes.Fetch, {
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

export const enhanceMap = {
  error: enhanceErrorListener,
  unhandledrejection: enhanceUnhandledrejectionListener,
  xhr: enhanceXhr,
  fetch: enhanceFetch
}
