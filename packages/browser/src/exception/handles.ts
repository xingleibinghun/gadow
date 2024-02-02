/**
 * 异常事件的处理函数集合
 */
import { EventTypes, HttpException } from '@sohey/types'
import { getClient } from '@sohey/core'
import { getErrorInfo } from '@sohey/utils'

const handleFactory = (transform: Function) => {
  return (...args: any[]) => {
    const data = transform(...args)
    if (!data) return
    const client = getClient()
    if (client) {
      client.getTransport().send(data)
    }
  }
}

const transformError = (err: Error | ErrorEvent) => {
  return {
    type: EventTypes.Error,
    data: getErrorInfo(err)
  }
}

const transformXhr = (data: HttpException) => {
  if (data.status === 200) return
  return {
    type: EventTypes.Xhr,
    data
  }
}

const transformFetch = (data: Omit<HttpException, 'type'>) => {
  if (data.isResolve && data.response?.ok) return
  return {
    type: EventTypes.Fetch,
    data
  }
}

const transformResource = (event: Event) => {
  const target = event.target as
    | HTMLScriptElement
    | HTMLLinkElement
    | HTMLImageElement
  const attributes = Array.from(target.attributes).reduce((acc, attr) => {
    // @ts-ignore
    acc[attr.name] = attr.value
    return acc
  }, {}) as {
    src?: string
    href?: string
  }
  return {
    type: EventTypes.Resource,
    data: {
      name: EventTypes.Resource,
      baseURI: target.baseURI,
      url: attributes.src || attributes.href,
      attributes
    }
  }
}

const transformUnhandledrejection = (err: PromiseRejectionEvent) => {
  return {
    type: EventTypes.Unhandledrejection,
    data: getErrorInfo(err.reason)
  }
}

export const HANDLES = {
  [EventTypes.Error]: handleFactory(transformError),
  [EventTypes.Xhr]: handleFactory(transformXhr),
  [EventTypes.Fetch]: handleFactory(transformFetch),
  [EventTypes.Resource]: handleFactory(transformResource),
  [EventTypes.Unhandledrejection]: handleFactory(transformUnhandledrejection)
}
