import { EventTypes } from '@sohey/shared'
import { HANDLES as exceptionHandles } from '../exception'
import { HANDLES as breadcrumbHandles } from '../breadcrumb'

/**
 * 事件管理
 */
class EventEmitter {
  private pool: {
    [Key in EventTypes]?: Function[]
  }

  constructor() {
    this.pool = {}
  }

  init() {
    // 订阅事件
    for (const key in EventTypes) {
      // @ts-ignore
      const event = EventTypes[key]
        // @ts-ignore
      ;[exceptionHandles[event], breadcrumbHandles[event]]
        .filter(Boolean)
        .forEach(handle => {
          this.on(event as EventTypes, handle)
        })
    }
  }

  on(event: EventTypes, callback: Function) {
    if (!this.pool[event]) {
      this.pool[event] = []
    }
    (this.pool[event] as Function[]).push(callback)
  }

  once(event: EventTypes, onceCallback: Function) {
    const callback = (...args: any[]) => {
      onceCallback(...args)
      this.off(event, onceCallback)
    }
    this.on(event, callback)
  }

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

export const eventEmitter = new EventEmitter()
