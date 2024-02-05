import { EventTypes } from '@gadow/types'
import { global } from '@gadow/utils'
import { TestClient, getDefaultClientOptions, setClient } from '../mocks/client'
import { dsn, apiToken } from '../mocks/config'

describe('Client', () => {
  // @ts-ignore
  const beforeTransport = jest.fn(event => event)

  beforeEach(() => {
    global.__Gadow = undefined
  })

  afterEach(() => {
    beforeTransport.mockClear()
  })

  describe('dsn', () => {
    it('getDsn', () => {
      const options = getDefaultClientOptions({ dsn })
      const client = new TestClient(options)

      expect(client.getDsn()).toEqual(dsn)
    })
  })

  describe('options', () => {
    it('getOptions', () => {
      const options = getDefaultClientOptions({ dsn })
      const client = new TestClient(options)

      expect(client.getOptions()).toEqual(options)
    })
  })

  describe('transport', () => {
    it('transport has been defined', () => {
      const options = getDefaultClientOptions()
      const client = new TestClient(options)

      expect(client.getTransport()).toBeDefined()
    })
  })

  describe('captureException', () => {
    it('capture and send exception', () => {
      const options = getDefaultClientOptions({ dsn, beforeTransport, apiToken })
      const client = new TestClient(options)

      setClient(client)
      client.captureException(new Error('test error'))

      const event = beforeTransport.mock.calls[0][0]
      expect(event).toBeDefined()
      expect(event.type).toEqual(EventTypes.Error)
      expect(event.data.message).toEqual('test error')
      expect(event.data.name).toEqual('Error')
      expect(event.data.stack).not.toHaveLength(0)
    })
  })

  describe('plugin', () => {
    it('addPlugin', () => {
      class TestPlugin {
        name = 'TestPlugin'
        setup() {}
      }
      const options = getDefaultClientOptions({ dsn })
      const client = new TestClient(options)

      expect(Object.keys(client.getPlugins())).toHaveLength(0)

      client.addPlugin(new TestPlugin())

      expect(Object.keys(client.getPlugins())).toHaveLength(1)
    })
  })
})
