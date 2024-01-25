import { record as recordByRrweb } from 'rrweb'
import { transport } from '../core/transport'
import { EventTypes, RecordEvent } from '@sohey/shared'

export class Record {
  // 事件组
  eventsMatrix: RecordEvent[][] = [[]]
  // 有效(需要上报)的事件组数量
  effectiveEventsMatrix: number = 2
  stopRecordFn

  init() {
    if (this.stopRecordFn) {
      return console.error('Do not call the `init` method repeatedly')
    }
    this.stopRecordFn = recordByRrweb({
      emit: (event, isCheckout) => {
        if (isCheckout) {
          this.eventsMatrix.push([])
          this.checkEventsMatrix()
        }
        const lastEvents = this.eventsMatrix[this.eventsMatrix.length - 1]
        lastEvents.push(event)
      },
      checkoutEveryNth: 20
    })
  }

  checkEventsMatrix() {
    while (this.eventsMatrix.length > this.effectiveEventsMatrix) {
      this.eventsMatrix.shift()
    }
  }

  transportRecentEvents(uuid) {
    const events = Array.prototype.flat.call(this.eventsMatrix)
    transport.send({
      type: EventTypes.Record,
      data: {
        events,
        uuidForEvent: uuid
      }
    })
  }

  stopRecord() {
    typeof this.stopRecordFn === 'function' && this.stopRecordFn()
  }
}

export const record = new Record()
