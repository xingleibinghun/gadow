import { getClient, createTransport } from '@gadow/core'
import {
  TransportOptions,
  TransportTarget,
  TransportRequest,
  ClientOptions
} from '@gadow/types'
import fetch from 'node-fetch'

const fetchRequest: TransportRequest = (
  options: TransportOptions,
  data: TransportTarget
) => {
  const client = getClient()
  if (!client) return Promise.reject()
  try {
    return fetch(client.getDsn(), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

export const transport: ClientOptions['transport'] = options => {
  return createTransport(options, fetchRequest)
}
