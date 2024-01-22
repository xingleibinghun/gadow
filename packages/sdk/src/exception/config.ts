/**
 * 异常事件的处理函数集合
 */
import { ExceptionTypes, HttpException, ResourceException } from '@sohey/shared'
import { transport } from '../core'
import { getErrorInfo } from '../utils'

const handleError = err => {
  transport.send({
    type: ExceptionTypes.Error,
    data: getErrorInfo(err) // 对 err 参数类型进一步判断处理
  })
}

const handleXhr = data => {
  if (data.status !== 200) {
    transport.send({
      type: ExceptionTypes.Xhr,
      data: data
    })
  }
}

const handleFetch = (data: Omit<HttpException, 'type'>) => {
  if (data.isResolve && data.response?.ok) return
  transport.send({
    type: ExceptionTypes.Fetch,
    data: data
  })
}

const handleResource = (event: Event): ResourceException => {
  const { target } = event
  const attributes = Array.from(target.attributes).reduce((acc, attr) => {
    acc[attr.name] = attr.value
    return acc
  }, {})
  return {
    name: ExceptionTypes.Resource,
    baseURI: target.baseURI,
    url: attributes.src || attributes.href,
    attributes
  }
}

const handleUnhandledrejection = err => {
  transport.send({
    type: ExceptionTypes.Unhandledrejection,
    data: getErrorInfo(err.reason)
  })
}

const handleWhiteScreen = err => {
  transport.send({
    type: ExceptionTypes.WhiteScreen,
    data: err
  })
}

export const HANDLES = {
  [ExceptionTypes.Error]: handleError,
  [ExceptionTypes.Xhr]: handleXhr,
  [ExceptionTypes.Fetch]: handleFetch,
  [ExceptionTypes.Resource]: handleResource,
  [ExceptionTypes.Unhandledrejection]: handleUnhandledrejection,
  [ExceptionTypes.WhiteScreen]: handleWhiteScreen
}
