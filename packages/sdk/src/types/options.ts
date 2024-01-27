import { TransportTarget } from './transport'

export interface Options {
  dsn: string
  apiToken: string
  beforeTransport?: (data: TransportTarget) => TransportTarget
  record?: boolean
}
