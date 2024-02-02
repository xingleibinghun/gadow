import { ClientOptions } from './options'
import { Plugin } from './plugin'
import { Transport } from './transport'

export interface Client<O extends ClientOptions = ClientOptions> {
  captureException(err: any): void

  getOptions(): O

  getDsn(): O['dsn']

  getTransport(): Transport

  addPlugin(plugin: Plugin): void

  getPlugin(name: string): Plugin | null

  initPlugins(): void

  setupPlugin(plugin: Plugin): void

  init(): void
}
