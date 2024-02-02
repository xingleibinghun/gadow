import { Client } from '@sohey/types'

interface Global extends Window {
  __Sohey?: {
    client?: Client
  }
}

export const getGlobal = (): Global => {
  return window as Global
}

const global = getGlobal()

export { global }
