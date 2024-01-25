import { v4 as uuidv4 } from 'uuid'
import { TransportOptions, Send, TransportTarget } from '../types'
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

  transformData(data): TransportTarget {
    data = Object.assign(data, {
      time: +new Date(),
      apiToken: options.apiToken,
      url: location.href,
      device: device.getDevice(),
      user: user.getUser(),
      version: '', // TODO
      breadcrumb: breadcrumb.getAll()
    })
    if (!data.uuid) data.uuid = uuidv4()
    if (typeof this.beforeTransport === 'function')
      data = this.beforeTransport(data)
    return data
  }

  request(data) {
    const dsn = options.dsn
    this.queue.add(() => this.xhr(dsn, data))
    // TODO add gif request
  }

  xhr(dsn, data) {
    // TODO debug
    console.log('上报数据', data)
    return Promise.resolve()
    // return fetch(dsn, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
  }

  send: Send = data => {
    if (!data.type) return
    data = this.transformData(data)
    this.request(data)
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
