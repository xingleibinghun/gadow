import { EventTypes } from './event'
import { BreadcrumbData } from './breadcrumb'
import { ExceptionData } from './exception'
import { ReplayData } from './replay'

export type Send = (data: TransportOrigin) => void

export type TransportOrigin = Pick<TransportTarget, 'type' | 'data'>

export interface TransportTarget {
  type: EventTypes // 事件类型
  time: number // 时间戳
  apiToken: string // 项目 apiToken
  url: string // 当前页面 url
  device?: any // 设备信息
  user?: any // 用户信息
  version: string // sdk 版本
  breadcrumb?: BreadcrumbData[] // 用户行为
  uuid: string
  replayId?: string
  data: ExceptionData | ReplayData // 事件的具体数据
}

export interface TransportOptions {
  headers?: {
    [key: string]: unknown
  }
}

export interface Transport {
  send(data: TransportOrigin): Promise<unknown>
}

export type TransportRequest = (
  transportOptions: TransportOptions,
  data: TransportTarget
) => Promise<unknown>
