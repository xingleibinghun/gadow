import { EventTypes } from './event'

export type BreadcrumbData = HistoryBreadcrumb | ClickBreadcrumb

export interface HistoryBreadcrumb {
  type: EventTypes.History | EventTypes.Hashchange
  data: {
    from: string
    to: string
  }
}

export interface ClickBreadcrumb {
  type: EventTypes.Click
  data: string
}
