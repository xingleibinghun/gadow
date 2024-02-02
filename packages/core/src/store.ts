import { BreadcrumbData, Device, Store as IStore, User } from '@sohey/types'
import { hasOwnProperty } from '@sohey/utils'
import { UAParser } from 'ua-parser-js'

let globalStore: Store | undefined

class Store implements IStore {
  protected user: User

  protected device: Device

  protected breadcrumbs: BreadcrumbData[]
  protected maxBreadcrumbs: number

  protected replayId: string

  constructor() {
    this.breadcrumbs = []
    this.maxBreadcrumbs = 10
    this.replayId = ''
    this.init()
  }

  init() {
    this.setDevice(new UAParser().getResult())
  }

  setUser(user: User) {
    this.user = user
  }

  getUser() {
    return this.user
  }

  setDevice(device: Device) {
    this.device = device
  }

  getDevice() {
    return this.device
  }

  setReplayId(id: string) {
    this.replayId = id
  }

  getReplayId() {
    return this.replayId
  }

  addBreadcrumb(data: BreadcrumbData) {
    if (!hasOwnProperty(data, 'type')) return
    this.breadcrumbs.push(data)
    this.checkBreadcrumbs()
  }

  getBreadcrumbs() {
    return this.breadcrumbs
  }

  checkBreadcrumbs() {
    while (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift()
    }
  }

  clearBreadcrumbs() {
    this.breadcrumbs = []
  }
}

export const setStore = (store: Store) => {
  globalStore = store
}

export const getStore = (): Store => {
  if (!globalStore) {
    setStore(new Store())
  }
  return globalStore as Store
}


