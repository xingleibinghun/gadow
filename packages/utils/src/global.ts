import { Client, Store } from '@gadow/types'

interface Global extends Window {
  __Gadow?: {
    client?: Client
    store?: Store
  }
}

export const getGlobal = (): Global => {
  return window as Global
}

const global = getGlobal()

export { global }
