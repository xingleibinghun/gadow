/**
 * 用户行为事件的处理函数集合
 */

import { BreadcrumbTypes } from '@sohey/shared'
import { transport } from '../core'

export const HANDLES = {
  [BreadcrumbTypes.History]: data => {
    transport.send({
      type: BreadcrumbTypes.History,
      data: data
    })
  },
  [BreadcrumbTypes.Hashchange]: data => {
    transport.send({
      type: BreadcrumbTypes.Hashchange,
      data: data
    })
  },
  [BreadcrumbTypes.Click]: e => {
    transport.send({
      type: BreadcrumbTypes.Click,
      data: e
    })
  },
  [BreadcrumbTypes.Resource]: data => {
    transport.send({
      type: BreadcrumbTypes.Resource,
      data: data
    })
  }
}
