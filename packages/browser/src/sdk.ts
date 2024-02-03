import { getEventEmitter } from '@sohey/core'
import {
  EventTypes,
  Options,
  ExceptionTypes,
  BreadcrumbTypes,
  ClientOptions
} from '@sohey/types'
import { global, hasProperty, deduplicateArray } from '@sohey/utils'
import { BrowserClient } from './client'
import { transport } from './transport'
import { enhanceMap } from './enhance'
import { HANDLES as EXCEPTION_HANDLES } from './exception'
import { HANDLES as BREADCRUMB_HANDLES } from './breadcrumb'

export const init = (opts: Options) => {
  const clientOptions: ClientOptions = {
    ...opts,
    transport: opts.transport || transport
  }

  const client = new BrowserClient(clientOptions)
  setClient(client)

  initEnhance(clientOptions)
  initEventListener(clientOptions)
}

const setClient = (client: BrowserClient) => {
  if (!global.__Sohey) {
    global.__Sohey = {
      client
    }
  } else {
    global.__Sohey.client = client
  }
}

const initEnhance = (options: ClientOptions) => {
  const { exceptionOptions = {}, breadcrumbOptions = {} } = options
  const allEvents = deduplicateArray(
    Object.values({
      ...ExceptionTypes,
      ...BreadcrumbTypes
    })
  ) as EventTypes[]
  allEvents
    .filter(
      event =>
        // @ts-ignore
        exceptionOptions[event] !== false || breadcrumbOptions[event] !== false
    )
    .forEach(event => {
      if (hasProperty(enhanceMap, event)) {
        // @ts-ignore
        enhanceMap[event]()
      }
    })
}

const initEventListener = (options: ClientOptions) => {
  function _init(
    config:
      | ClientOptions['exceptionOptions']
      | ClientOptions['breadcrumbOptions'] = {},
    handles: {
      [key: string]: Function
    },
    events: (ExceptionTypes | BreadcrumbTypes)[]
  ) {
    events
      // @ts-ignore
      .filter(event => config[event] !== false)
      .forEach(event => {
        if (handles[event]) {
          // @ts-ignore
          getEventEmitter().on(event as EventTypes, handles[event])
        }
      })
  }
  _init(
    options.exceptionOptions,
    EXCEPTION_HANDLES,
    Object.values({ ...ExceptionTypes })
  )
  _init(
    options.breadcrumbOptions,
    BREADCRUMB_HANDLES,
    Object.values({ ...BreadcrumbTypes })
  )
}
