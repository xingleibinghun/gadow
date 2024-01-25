/**
 * 异常事件的处理函数集合
 */
import { v4 as uuidv4 } from 'uuid'
import { ExceptionTypes, HttpException, ResourceException } from '@sohey/shared'
import { transport } from '../core/transport'
import { record } from '../record'
import { getErrorInfo } from '../utils'

const handleFactory = transform => {
  return (...args) => {
    const uuid = uuidv4()
    record.transportRecentEvents(uuid)
    const data = transform(...args)
    if (!data) return
    data.uuid = uuid
    transport.send(data)
  }
}

const transformError = err => {
  return {
    type: ExceptionTypes.Error,
    data: getErrorInfo(err) // 对 err 参数类型进一步判断处理
  }
}

const transformXhr = data => {
  if (data.status === 200) return
  return {
    type: ExceptionTypes.Xhr,
    data: data
  }
}

const transformFetch = (data: Omit<HttpException, 'type'>) => {
  if (data.isResolve && data.response?.ok) return
  return {
    type: ExceptionTypes.Fetch,
    data: data
  }
}

const transformResource = (event: Event): ResourceException => {
  const { target } = event
  const attributes = Array.from(target.attributes).reduce((acc, attr) => {
    acc[attr.name] = attr.value
    return acc
  }, {})
  return {
    type: ExceptionTypes.Resource,
    data: {
      name: ExceptionTypes.Resource,
      baseURI: target.baseURI,
      url: attributes.src || attributes.href,
      attributes
    }
  }
}

const transformUnhandledrejection = err => {
  return {
    type: ExceptionTypes.Unhandledrejection,
    data: getErrorInfo(err.reason)
  }
}

export const HANDLES = {
  [ExceptionTypes.Error]: handleFactory(transformError),
  [ExceptionTypes.Xhr]: handleFactory(transformXhr),
  [ExceptionTypes.Fetch]: handleFactory(transformFetch),
  [ExceptionTypes.Resource]: handleFactory(transformResource),
  [ExceptionTypes.Unhandledrejection]: handleFactory(
    transformUnhandledrejection
  )
}
