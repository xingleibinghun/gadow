import fetch from 'node-fetch'
import { getClient, getStore } from '@gadow/core'
import { EventTypes } from '@gadow/types'
import { init, captureException } from '../../src'
import { sleep, xhr } from '../utils'
import { transport as defaultTransport } from '../mocks/transport'
import { dsn, apiToken, requestUrl } from '../mocks/config'

describe('Browser', () => {
  // @ts-ignore
  const beforeTransport = jest.fn(event => event)

  beforeAll(() => {
    init({
      dsn,
      apiToken,
      beforeTransport,
      transport: defaultTransport
    })
  })

  afterEach(() => {
    beforeTransport.mockClear()
  })

  describe('transport', () => {
    it('should send error info', () => {
      const client = getClient()
      client?.getTransport().send({
        type: EventTypes.Error,
        data: {
          message: '错误信息'
        }
      })

      expect(beforeTransport).toHaveBeenCalled()
    })
  })

  describe('capture exception', () => {
    it('should capture an error', () => {
      try {
        throw new Error('test error')
      } catch (e: any) {
        captureException(e)
      }

      const event = beforeTransport.mock.calls[0][0]
      expect(event).toBeDefined()
      expect(event.type).toEqual(EventTypes.Error)
      expect(event.data.message).toEqual('test error')
      expect(event.data.name).toEqual('Error')
      expect(event.data.stack).not.toHaveLength(0)
    })

    it('should capture an xhr exception', async () => {
      try {
        await xhr('POST', requestUrl)
      } catch (err) {
        /* empty */
      }

      const event = beforeTransport.mock.calls[0][0]
      expect(event).toBeDefined()
      expect(event.type).toEqual(EventTypes.Xhr)
      expect(event.data.method).toEqual('POST')
      expect(event.data.url).toEqual(requestUrl)
      expect(event.data.ok).toEqual(false)
      expect(event.data.status).toEqual(0)
    })
  })
})
