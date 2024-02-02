import { BreadcrumbData } from './breadcrumb'
import { User } from './user'
import { Device } from './device'

export interface Store {
  init?(): void

  setUser(user: User): void

  getUser(): User | undefined

  setDevice(device: Device): void

  getDevice(): void

  setReplayId(id: string): void

  getReplayId(): string

  addBreadcrumb(data: BreadcrumbData): void

  getBreadcrumbs(): BreadcrumbData[]

  checkBreadcrumbs(): void

  clearBreadcrumbs(): void
}
