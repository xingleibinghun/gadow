export type RecordEvent = {
  type: number
  data: unknown
  timestamp: number
  delay?: number
}

export type RecordData = {
  events: RecordEvent[]
  uuidForEvent: string // 关联事件(触发录屏上报的事件)的 uuid
}
