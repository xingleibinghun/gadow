import { EventTypes } from '@gadow/types'
import { EventEmitter, getEventEmitter, setEventEmitter } from '../../src/event'

describe('Event', () => {
  // @ts-ignore
  const callback = jest.fn(event => event)

  beforeEach(() => {
    setEventEmitter(new EventEmitter())
  })

  afterEach(() => {
    callback.mockClear()
  })

  describe('eventEmitter', () => {
    it('on() / emit() / off()', () => {
      const eventEmitter = getEventEmitter()
      eventEmitter.on(EventTypes.Error, callback as Function)

      expect(callback).toBeCalledTimes(0)

      eventEmitter.emit(EventTypes.Error)

      expect(callback).toBeCalledTimes(1)

      eventEmitter.off(EventTypes.Error, callback as Function)
      eventEmitter.emit(EventTypes.Error)

      expect(callback).toBeCalledTimes(1)
    })

    it('once()', () => {
      const eventEmitter = getEventEmitter()
      eventEmitter.once(EventTypes.Error, callback as Function)
      eventEmitter.emit(EventTypes.Error)

      expect(callback).toBeCalledTimes(1)

      eventEmitter.emit(EventTypes.Error)

      expect(callback).toBeCalledTimes(1)
    })

    it('batchOn()', () => {
      const eventEmitter = getEventEmitter()
      eventEmitter.batchOn(
        [EventTypes.Error, EventTypes.Resource],
        callback as Function
      )
      eventEmitter.emit(EventTypes.Error)
      eventEmitter.emit(EventTypes.Resource)

      expect(callback).toBeCalledTimes(2)
    })
  })
})
