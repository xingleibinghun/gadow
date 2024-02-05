import {
  Queue,
  Types as QueueTypes,
  generateId,
  getInternalPluginName
} from '@gadow/utils'
import {
  Transport,
  TransportOptions,
  TransportRequest,
  TransportTarget
} from '@gadow/types'
import { getClient } from './client'
import { getStore } from './store'

export const createTransport = (
  options: TransportOptions,
  request: TransportRequest
): Transport => {
  const queue = new Queue(QueueTypes.Async, true)

  const send: Transport['send'] = data => {
    const client = getClient()
    if (!client) return Promise.reject()

    const store = getStore()
    const clientOptions = client.getOptions()
    let params = Object.assign(data, {
      time: +new Date(),
      apiToken: clientOptions.apiToken,
      url: location.href,
      device: store.getDevice(),
      user: store.getUser(),
      version: '', // TODO
      breadcrumb: store.getBreadcrumbs(),
      uuid: generateId()
    }) as TransportTarget

    const hasReplay = !!client.getPlugin(getInternalPluginName('replay'))
    if (hasReplay) {
      params.replayId = store.getReplayId()
    }

    if (typeof clientOptions.beforeTransport === 'function')
      params = clientOptions.beforeTransport(params)

    return new Promise((resolve, reject) => {
      queue.add(() => {
        request(options, params).then(resolve).catch(reject)
      })
    })
  }

  return {
    send
  }
}
