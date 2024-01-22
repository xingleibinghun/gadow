import { EventTypes } from '@sohey/shared'
import { HANDLES as exceptionHandles } from '../exception'
import { HANDLES as breadcrumbHandles } from '../breadcrumb'
import { enhanceMap } from './enhance'

/**
 * 事件管理
 */
class EventEmitter {
  private pool

  constructor() {
    this.pool = {}
  }

  init() {
    // 增强底层函数
    for (const key in enhanceMap) {
      enhanceMap[key]()
    }

    // 订阅事件
    for (const key in EventTypes) {
      const event = EventTypes[key]
      ;[exceptionHandles[event], breadcrumbHandles[event]]
        .filter(Boolean)
        .forEach(handle => {
          this.on(event, handle)
        })
    }
  }

  on(event, callback) {
    if (!this.pool[event]) {
      this.pool[event] = []
    }
    this.pool[event].push(callback)
  }

  once(event, onceCallback) {
    const callback = (...args) => {
      onceCallback(...args)
      this.off(event, onceCallback)
    }
    this.on(event, callback)
  }

  emit(event, ...args) {
    const callbacks = this.pool[event]
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }

  off(event, offCallback) {
    const callbacks = this.pool[event]
    if (callbacks) {
      const index = callbacks.findIndex(cb => cb === offCallback)
      callbacks.splice(index, 1)
      if (callbacks.length === 0) delete this.pool[event]
    }
  }
}

export const eventEmitter = new EventEmitter()
