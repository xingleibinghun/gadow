import { BreadcrumbTypes } from './event'

export type BreadcrumbData = HistoryBreadcrumb | ClickBreadcrumb

export interface HistoryBreadcrumb {
  type: BreadcrumbTypes.History | BreadcrumbTypes.Hashchange
  data: {
    from: string
    to: string
  }
}

export interface ClickBreadcrumb {
  type: BreadcrumbTypes.Click
  data: string
}
