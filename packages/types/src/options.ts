import { Transport, TransportOptions, TransportTarget } from './transport'
import { ExceptionTypes, BreadcrumbTypes } from './event'
import { Plugin } from './plugin'

export interface Options extends Omit<ClientOptions, 'transport'> {
  transport?: ClientOptions['transport']
}

// export type Options = Omit<BaseOptions, 'transport'> &
//   Partial<Pick<BaseOptions, 'transport'>>

export interface ClientOptions {
  dsn: string
  apiToken: string
  beforeTransport?: (data: TransportTarget) => TransportTarget
  record?: boolean
  transport: (options: TransportOptions) => Transport
  transportOptions?: TransportOptions
  exceptionOptions?: {
    [Key in ExceptionTypes]?: Boolean
  }
  breadcrumbOptions?: {
    [Key in BreadcrumbTypes]?: Boolean
  }
  plugins?: Plugin[]
}
