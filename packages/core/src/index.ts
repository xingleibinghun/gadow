import { BreadcrumbData, TransportOrigin, User } from '@sohey/types'
import { getStore } from './store'
import { getClient } from './client'

export * from './client'
export * from './store'
export * from './transport'
export * from './event'

export const setUser = (user: User) => {
  getStore().setUser(user)
}

export const addBreadcrumb = (data: BreadcrumbData) => {
  getStore().addBreadcrumb(data)
}

export const transport = (data: TransportOrigin) => {
  const client = getClient()
  if (!client) return
  return client.getTransport().send(data)
}

export const captureException = (err: any) => {
  const client = getClient()
  if (!client) return
  return client.captureException(err)
}
