import { getClient, createTransport } from '../../src'
import {
  Transport,
  TransportOptions,
  TransportRequest,
  TransportTarget
} from '@gadow/types'
import { xhr } from '../utils'

export const fetchRequest: TransportRequest = (
  options: TransportOptions,
  data: TransportTarget
) => {
  const client = getClient()
  if (!client) return Promise.reject()
  try {
    return xhr('POST', client.getDsn(), data, options)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const transport = (options: TransportOptions): Transport => {
  return createTransport(options, fetchRequest)
}
