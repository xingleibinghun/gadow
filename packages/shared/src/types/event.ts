/**
 * 事件
 */
export enum EventTypes {
  /**
   * 异常
   */
  Code = 'code',
  Xhr = 'xhr',
  Fetch = 'fetch',
  Resource = 'resource',
  WhiteScreen = 'whiteScreen',
  React = 'react',
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
  RecordScreen = 'recordScreen'
}

/**
 * 用户行为
 */
export enum BreadcrumbTypes {
  History = 'history',
  Hashchange = 'hashchange',
  Click = 'click',
  Resource = 'resource'
}

/**
 * 异常
 */
export enum ExceptionTypes {
  Code = 'code',
  Xhr = 'xhr',
  Fetch = 'fetch',
  Resource = 'resource',
  WhiteScreen = 'whiteScreen',
  React = 'react'
}
