import ErrorStackParser from 'error-stack-parser'
import { ExceptionTypes } from './common'

export type ExceptionData =
  | CodeException
  | HttpException
  | ResourceException
  | WhiteScreenException
  | ReactException

export interface CodeException {
  message: string
  name?: string
  cause?: string
  stack?: ErrorStackParser.StackFrame[]
}

export interface HttpException {
  type: ExceptionTypes.Xhr | ExceptionTypes.Fetch
  url: string // 接口地址
  method: string // 请求方法
  // durationTime: number // 请求持续时长
  body?: any
  header?: object
  isResolve: boolean // fetch promise 状态(非接口响应状态)
  response?: { // 响应数据
    ok: boolean
    redirected: boolean
    status: number
    statusText: string
    type: string
  }
  rejectReason: any
}

export interface ResourceException {
  name: string // 脚本地址
  message: string // 错误信息
}

export interface WhiteScreenException {
  name: string // 页面地址
}

export interface ReactException extends CodeException {}
