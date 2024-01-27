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
  Record = 'record'
}
