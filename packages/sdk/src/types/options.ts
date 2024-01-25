import { TransportOrigin, TransportTarget } from './transport'

export interface Options {
  dsn: string
  apiToken: string
  beforeTransport?: (data: TransportOrigin) => TransportTarget
  record?: boolean
}
