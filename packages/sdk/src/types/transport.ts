import { EventTypes, BreadcrumbData, ExceptionData } from '@sohey/shared'
import { Options } from './options'

export type Send = (data: TransportOrigin) => void

export interface TransportOrigin {
  type: EventTypes // 事件类型
  data: ExceptionData // 事件的具体数据
}

export interface TransportTarget extends TransportOrigin {
  type: EventTypes // 事件类型
  time: number // 时间戳
  apiKey: string // 项目 apiKey
  url: string // 当前页面 url
  device?: any // 设备信息
  user?: any // 用户信息
  version: string // sdk 版本
  breadcrumb?: BreadcrumbData[] // 用户行为
  data: ExceptionData // 事件的具体数据
}

export interface TransportOptions {
  beforeTransport?: Options['beforeTransport']
}
