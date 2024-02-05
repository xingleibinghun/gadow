/**
 * 用户行为事件的处理函数集合
 */
import { getStore } from '@gadow/core'
import { EventTypes, HistoryBreadcrumb } from '@gadow/types'
import { getRelativeUrl } from '../utils'

const handleFactory = (transform: Function): Function => {
  return (...args: any[]) => {
    const data = transform(...args)
    if (!data) return
    const store = getStore()
    store.addBreadcrumb(data)
  }
}

const transformHistory = (data: HistoryBreadcrumb['data']) => {
  return {
    type: EventTypes.History,
    data
  }
}

const transformHashChange = (e: HashChangeEvent) => {
  return {
    type: EventTypes.Hashchange,
    data: {
      from: getRelativeUrl(e.oldURL),
      to: getRelativeUrl(e.newURL)
    }
  }
}

const transformClick = (e: Event) => {
  // TODO 简化 data -> 自身标签加前部分子节点内容
  return {
    type: EventTypes.Click,
    data: (e.target as HTMLElement).outerHTML
  }
}

export const HANDLES = {
  [EventTypes.History]: handleFactory(transformHistory),
  [EventTypes.Hashchange]: handleFactory(transformHashChange),
  [EventTypes.Click]: handleFactory(transformClick)
}
