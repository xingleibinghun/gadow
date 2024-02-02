/**
 * 事件
 */
export enum EventTypes {
  /**
   * 异常
   */
  Error = 'error', // 常规错误/代码错误等window.addEventListener('error') 能捕获到的
  Xhr = 'xhr',
  Fetch = 'fetch',
  Resource = 'resource',
  Unhandledrejection = 'unhandledrejection',
  /**
   * 用户行为
   */
  History = 'history',
  Hashchange = 'hashchange',
  Click = 'click',
  /**
   * 性能
   */
  Performance = 'performance',
  /**
   * 录屏
   */
  Replay = 'replay'
}

export enum ExceptionTypes {
  Error = 'error', // 常规错误/代码错误等window.addEventListener('error') 能捕获到的
  Xhr = 'xhr',
  Fetch = 'fetch',
  Resource = 'resource',
  Unhandledrejection = 'unhandledrejection'
}

export enum BreadcrumbTypes {
  History = 'history',
  Hashchange = 'hashchange',
  Click = 'click'
}
