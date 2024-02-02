export type ReplayEvent = {
  type: number
  data: unknown
  timestamp: number
  delay?: number
}

export type ReplayData = {
  events: ReplayEvent[]
}
