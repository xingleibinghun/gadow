import { record as recordByRrweb } from 'rrweb'
import { getClient, getStore } from '@gadow/core'
import {
  EventTypes,
  ExceptionTypes,
  PluginSetupOptions,
  ReplayEvent
} from '@gadow/types'
import { generateId, getInternalPluginName } from '@gadow/utils'
import { ReplayOptions } from './types'

// @ts-ignore
const DEFAULT_EVENTS = Object.values({ ...ExceptionTypes }) as EventTypes[]

export class Replay {
  name: string = getInternalPluginName('Replay')

  protected events: EventTypes[]
  // 事件组
  protected eventsMatrix: ReplayEvent[][] = [[]]
  // 有效(需要上报)的事件组数量
  protected maxEventsMatrix: number
  protected stopRecordFn?: () => void
  protected unitMatrixLen: number

  constructor(options: ReplayOptions = {}) {
    const { events, maxEventsMatrix = 2, unitMatrixLen = 20 } = options
    this.events = events || DEFAULT_EVENTS
    this.maxEventsMatrix = maxEventsMatrix
    this.unitMatrixLen = unitMatrixLen
  }

  setup(options: PluginSetupOptions) {
    const { subscribe } = options
    subscribe(this.events, () => this.transportRecentEvents())
    this.initRecord()
    return this
  }

  initRecord() {
    if (this.stopRecordFn) return

    this.refreshReplayId()
    this.stopRecordFn = recordByRrweb({
      emit: (event, isCheckout) => {
        if (isCheckout) {
          this.eventsMatrix.push([])
          this.checkEventsMatrix()
        }
        const lastEvents = this.eventsMatrix[this.eventsMatrix.length - 1]
        lastEvents.push(event)
      },
      checkoutEveryNth: this.unitMatrixLen
    })
  }

  checkEventsMatrix() {
    while (this.eventsMatrix.length > this.maxEventsMatrix) {
      this.eventsMatrix.shift()
    }
  }

  async transportRecentEvents() {
    if (!this.stopRecordFn) return

    const events = Array.prototype.flat.call(this.eventsMatrix) as ReplayEvent[]
    const client = getClient()
    if (client) {
      await client.getTransport().send({
        type: EventTypes.Replay,
        data: {
          events
        }
      })
      this.refreshReplayId()
    }
  }

  stopRecord() {
    typeof this.stopRecordFn === 'function' && this.stopRecordFn()
  }

  refreshReplayId() {
    const store = getStore()
    store.setReplayId(generateId())
  }

  isTraceEvent(event: EventTypes) {
    return this.events.indexOf(event) !== -1
  }
}
