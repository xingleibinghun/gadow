import { EventTypes } from '@gadow/types'

let globalEventEmitter: EventEmitter | undefined

/**
 * 事件管理
 */
export class EventEmitter {
  private pool: {
    [Key in EventTypes]?: Function[]
  }

  constructor() {
    this.pool = {}
  }

  on(event: EventTypes, callback: Function) {
    if (!this.pool[event]) {
      this.pool[event] = []
    }
    ;(this.pool[event] as Function[]).push(callback)
  }

  batchOn(events: EventTypes[], callback: Function) {
    events.forEach(event => {
      this.on(event, callback)
    })
  }

  once(event: EventTypes, onceCallback: Function) {
    const callback = (...args: any[]) => {
      onceCallback(...args)
      this.off(event, onceCallback)
    }
    this.on(event, callback)
  }

  // args 类型待完善
  emit(event: EventTypes, ...args: any[]) {
    const callbacks = this.pool[event]
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }

  off(event: EventTypes, offCallback: Function) {
    const callbacks = this.pool[event]
    if (callbacks) {
      const index = callbacks.findIndex((cb: Function) => cb === offCallback)
      callbacks.splice(index, 1)
      // @ts-ignore
      if (callbacks.length === 0) delete this.pool[event]
    }
  }
}

export const setEventEmitter = (eventEmitter: EventEmitter) => {
  globalEventEmitter = eventEmitter
}

export const getEventEmitter = (): EventEmitter => {
  if (!globalEventEmitter) {
    setEventEmitter(new EventEmitter())
  }
  return globalEventEmitter as EventEmitter
}
