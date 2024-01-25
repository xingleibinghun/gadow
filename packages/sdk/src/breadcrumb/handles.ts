/**
 * 用户行为事件的处理函数集合
 */
import { BreadcrumbTypes, getRelativeUrl } from '@sohey/shared'
import { breadcrumb } from './breadcrumb'

const handleFactory = transform => {
  return (...args) => {
    const data = transform(...args)
    if (!data) return
    breadcrumb.add(data)
  }
}

const transformHistory = data => {
  return {
    type: BreadcrumbTypes.History,
    data
  }
}

const transformHashChange = (e: HashChangeEvent) => {
  return {
    type: BreadcrumbTypes.Hashchange,
    data: {
      from: getRelativeUrl(e.oldURL),
      to: getRelativeUrl(e.newURL)
    }
  }
}

const transformClick = e => {
  // TODO 简化 data -> 自身标签加前部分子节点内容
  return {
    type: BreadcrumbTypes.Click,
    data: e.target.outerHTML
  }
}

export const HANDLES = {
  [BreadcrumbTypes.History]: handleFactory(transformHistory),
  [BreadcrumbTypes.Hashchange]: handleFactory(transformHashChange),
  [BreadcrumbTypes.Click]: handleFactory(transformClick)
}
