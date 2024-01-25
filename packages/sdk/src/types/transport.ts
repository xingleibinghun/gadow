import { EventTypes, BreadcrumbData, ExceptionData, RecordData } from '@sohey/shared'
import { Options } from './options'

export type Send = (data: TransportOrigin) => void

export interface TransportOrigin {
  type: EventTypes // 事件类型
  data: ExceptionData | RecordData // 事件的具体数据
  uuid?: string // uuid(两个上报数据需要 uuid 关联的场景会传)
}

export interface TransportTarget extends TransportOrigin {
  type: EventTypes // 事件类型
  time: number // 时间戳
  apiToken: string // 项目 apiToken
  url: string // 当前页面 url
  device?: any // 设备信息
  user?: any // 用户信息
  version: string // sdk 版本
  breadcrumb?: BreadcrumbData[] // 用户行为
  uuid: string
  data: ExceptionData | RecordData // 事件的具体数据
}

export interface TransportOptions {
  beforeTransport?: Options['beforeTransport']
}
