import { EventTypes } from '@gadow/types'
import { createTransport } from '../../src/transport'
import { fetchRequest } from '../mocks/transport'
import { apiToken, dsn } from '../mocks/config'
import { getDefaultClientOptions, setClient, TestClient } from '../mocks/client'
import { sleep } from '../utils'

describe('Transport', () => {
  beforeAll(() => {
    const options = getDefaultClientOptions({ dsn, apiToken })
    const client = new TestClient(options)
    setClient(client)
  })

  describe('createTransport()', () => {
    it('has send method', () => {
      const transport = createTransport({}, fetchRequest)
      expect(transport).toBeDefined()
      expect(transport.send).toBeInstanceOf(Function)
    })

    it('transport.send()', async () => {
      const mockFn = jest.fn(fetchRequest)
      const transport = createTransport({}, mockFn)
      transport.send({
        type: EventTypes.Error,
        data: {
          message: 'test message'
        }
      })
      await sleep(10)

      expect(mockFn).toHaveBeenCalled()
    })
  })
})
