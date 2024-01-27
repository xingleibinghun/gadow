import { v4 as uuidv4 } from 'uuid'
import {
  TransportOptions,
  Send,
  TransportTarget,
  Options as IOptions, TransportOrigin
} from '../types'
import { Queue, Types as QueueTypes } from '../utils'
import { options } from './options'
import { user } from './user'
import { device } from './device'
import { breadcrumb } from '../breadcrumb'

export class Transport {
  beforeTransport?: TransportOptions['beforeTransport']

  queue: Queue = new Queue(QueueTypes.Async, true)

  bindModel(options: TransportOptions) {
    if (!validateOptions(options)) return this
    const { beforeTransport } = options
    this.beforeTransport = beforeTransport
    return this
  }

  transformData(data: TransportOrigin): TransportTarget {
    let result = Object.assign(data, {
      time: +new Date(),
      apiToken: options.apiToken,
      url: location.href,
      device: device.getDevice(),
      user: user.getUser(),
      version: '', // TODO
      breadcrumb: breadcrumb.getAll()
    }) as TransportTarget
    if (!result.uuid) result.uuid = uuidv4()
    if (typeof this.beforeTransport === 'function')
      result = this.beforeTransport(result)
    return result
  }

  request(data: TransportTarget) {
    const dsn = options.dsn
    this.queue.add(() => this.xhr(dsn, data))
    // TODO add gif request
  }

  xhr(dsn: IOptions['dsn'], data: TransportTarget) {
    return fetch(dsn, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  send: Send = data => {
    if (!data.type) return
    this.request(this.transformData(data))
  }
}

const validateOptions = (opts: TransportOptions) => {
  if (opts.beforeTransport && typeof opts.beforeTransport !== 'function') {
    console.error('`beforeTransport` should be a function')
    return false
  }
  return true
}

export const transport = new Transport()

export const transportSend: Send = data => transport.send(data)
