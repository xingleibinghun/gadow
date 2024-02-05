import { EventTypes } from './event'

export interface PluginSetupOptions {
  subscribe: (events: EventTypes[], callback: Function) => void
}

export interface Plugin {
  // 内置插件名前缀为 Gadow_
  name: string

  // 返回值挂载在 client.plugins
  setup(options: PluginSetupOptions): any

  [Key: string]: any
}
