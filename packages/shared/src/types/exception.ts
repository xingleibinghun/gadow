import ErrorStackParser from 'error-stack-parser'
import { ExceptionTypes } from './event'

export type ExceptionData = ErrorException | HttpException | ResourceException

export interface ErrorException {
  message: string
  name?: string
  stack?: ErrorStackParser.StackFrame[]
  filename?: string // 错误顶层 filename(针对特殊场景下的 ErrorEvent)
}

export interface HttpException {
  type: ExceptionTypes.Xhr | ExceptionTypes.Fetch
  url: string // 接口地址
  method: string // 请求方法
  // durationTime: number // 请求持续时长
  header?: object
  body?: any
  ok: boolean // 表明响应是否成功（状态码在 200-299 范围内）
  status: number
  response?: any // 响应数据
  isResolve?: boolean // fetch promise 状态(非接口响应状态)
  rejectReason?: any
}

export interface ResourceException {
  name: string // 资源名(script/link/img)
  baseURI: string
  url: string // 脚本地址
  attributes: Record<string, any> // 标签属性
}
