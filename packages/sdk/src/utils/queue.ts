import { global } from './global'

export enum Types {
  Async = 'async',
  Sync = 'sync'
}

abstract class BaseQueue {
  // 任务队列
  tasks: any[]

  /**
   *
   * @param type 同步 | 异步
   * @param autoExecute 自动执行(add() 执行之后)
   */
  constructor(public type: Types, public autoExecute: boolean) {}

  // 添加任务
  abstract add(fn): void

  // 执行任务队列
  abstract execute(): void

  getTasks() {
    return this.tasks
  }
}

export class Queue extends BaseQueue {
  tasks = []

  constructor(
    public type: Types = Types.Sync,
    public autoExecute: boolean = false
  ) {
    super(type, autoExecute)
  }

  add(fn) {
    if (typeof fn !== 'function') return
    this.tasks.push(fn)

    if (this.autoExecute) {
      this.execute()
    }
  }

  execute() {
    if (this.type === Types.Async) {
      if (global.requestIdleCallback) {
        requestIdleCallback(dealine => this.workLoop(dealine))
      } else if (global.Promise) {
        Promise.resolve().then(this.executeAll)
      } else {
        setTimeout(this.executeAll)
      }
    } else {
      this.executeAll()
    }
  }

  executeAll() {
    while (this.tasks.length) {
      this.tasks.shift()()
    }
  }

  workLoop(dealine) {
    let shouldYield = false
    while (this.tasks.length && !shouldYield) {
      this.tasks.shift()()
      shouldYield = dealine.timeRemaining() < 1
    }
    if (this.tasks.length) {
      requestIdleCallback(dealine => this.workLoop(dealine))
    }
  }
}
