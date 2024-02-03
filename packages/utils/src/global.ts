import { Client, Store } from '@sohey/types'

interface Global extends Window {
  __Sohey?: {
    client?: Client
    store?: Store
  }
}

export const getGlobal = (): Global => {
  return window as Global
}

const global = getGlobal()

export { global }
