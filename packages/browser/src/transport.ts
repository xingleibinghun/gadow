import { getClient, createTransport } from '@sohey/core'
import {
  TransportOptions,
  TransportTarget,
  TransportRequest,
  ClientOptions
} from '@sohey/types'

const fetchRequest: TransportRequest = (
  options: TransportOptions,
  data: TransportTarget
) => {
  const client = getClient()
  if (!client) return Promise.reject()
  try {
    console.log('transport: ', data)
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
