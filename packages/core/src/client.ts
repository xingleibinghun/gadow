import {
  ClientOptions,
  Plugin,
  Client,
  Transport,
  EventTypes,
  PluginSetupOptions
} from '@gadow/types'
import { generateId, getErrorInfo, global, hasProperty } from '@gadow/utils'
import { getEventEmitter } from './event'

interface PluginMap {
  [key: string]: any
}

export abstract class BaseClient<O extends ClientOptions> implements Client<O> {
  protected options: O
  protected dsn: O['dsn']
  protected plugins: PluginMap
  protected transport?: Transport
  protected readonly SETUP_OPTIONS: PluginSetupOptions = {
    subscribe: (events: EventTypes[], callback: Function) =>
      getEventEmitter().batchOn(events, callback)
  }

  constructor(options: O) {
    this.options = options
    this.dsn = options.dsn
    this.plugins = {}
    this.transport = options.transport(options.transportOptions || {})
    this.init()
  }

  captureException(err: any) {
    this.getTransport().send({
      type: EventTypes.Error,
      data: getErrorInfo(err)
    })
  }

  getOptions() {
    return this.options
  }

  getDsn() {
    return this.dsn
  }

  getTransport() {
    return this.transport as Transport
  }

  addPlugin(plugin: Plugin) {
    if (!plugin.setup) return
    const name =
      plugin.name && !hasProperty(this.plugins, plugin.name)
        ? plugin.name
        : generateId()
    this.plugins[name] = plugin
    this.setupPlugin(plugin)
  }

  getPlugin(name: string) {
    return this.plugins[name]
  }

  initPlugins() {
    const { plugins = [] } = this.options
    plugins.forEach(plugin => this.addPlugin(plugin))
  }

  setupPlugin(plugin: Plugin) {
    plugin.setup(this.SETUP_OPTIONS)
  }

  init() {
    this.initPlugins()
  }
}

export const getClient = <C extends Client>(): C | undefined => {
  return global.__Gadow ? (global.__Gadow.client as C) : undefined
}
