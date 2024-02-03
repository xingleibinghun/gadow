import { global } from './global'

export enum Types {
  Async = 'async',
  Sync = 'sync'
}
type Task = () => void

abstract class BaseQueue {
  // 任务队列
  protected tasks: Task[] = []

  protected executing: boolean = false

  /**
   *
   * @param type 同步 | 异步
   * @param autoExecute 自动执行(add() 执行之后)
   */
  constructor(public type: Types, public autoExecute: boolean) {}

  // 添加任务
  abstract add(f: Function): void

  // 执行任务队列
  abstract execute(): void

  getTasks() {
    return this.tasks
  }

  setExecuting(executing: boolean) {
    this.executing = executing
  }
}

export class Queue extends BaseQueue {
  protected tasks: Task[] = []
  protected executing: boolean = false

  constructor(
    public type: Types = Types.Sync,
    public autoExecute: boolean = false
  ) {
    super(type, autoExecute)
  }

  add(fn: Task) {
    if (typeof fn !== 'function') return
    this.tasks.push(fn)

    if (this.autoExecute && !this.executing) {
      this.execute()
    }
  }

  execute() {
    if (this.executing) return
    if (this.type === Types.Async) {
      if ('requestIdleCallback' in global) {
        requestIdleCallback(dealine => this.workLoop(dealine))
      } else if ('Promise' in global) {
        Promise.resolve().then(() => {
          this.executeAll()
        })
      } else {
        setTimeout(this.executeAll)
      }
    } else {
      this.executeAll()
    }
  }

  protected executeAll() {
    this.setExecuting(true)
    while (this.tasks.length) {
      const fn = this.tasks.shift()
      typeof fn === 'function' && fn()
    }
    this.setExecuting(false)
  }

  workLoop: IdleRequestCallback = dealine => {
    let shouldYield = false
    while (this.tasks.length && !shouldYield) {
      const fn = this.tasks.shift()
      typeof fn === 'function' && fn()
      shouldYield = dealine.timeRemaining() < 1
    }
    if (this.tasks.length) {
      requestIdleCallback(dealine => this.workLoop(dealine))
    }
  }
}
