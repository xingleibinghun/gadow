/**
 * 异常事件的处理函数集合
 */
import { v4 as uuidv4 } from 'uuid'
import { EventTypes, HttpException, ResourceException } from '@sohey/shared'
import { transport } from '../core/transport'
import { record } from '../record'
import { getErrorInfo } from '../utils'

const handleFactory = (transform: Function) => {
  return (...args: any[]) => {
    const uuid = uuidv4()
    record.transportRecentEvents(uuid)
    const data = transform(...args)
    if (!data) return
    data.uuid = uuid
    transport.send(data)
  }
}

const transformError = (err: Error | ErrorEvent) => {
  return {
    type: EventTypes.Error,
    data: getErrorInfo(err) // 对 err 参数类型进一步判断处理
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
    data: data
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
