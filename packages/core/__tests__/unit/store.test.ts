import { EventTypes } from '@sohey/types'
import { getStore, setStore, Store } from '../../src/store'

describe('Store', () => {
  beforeEach(() => {
    setStore(new Store())
  })

  describe('user', () => {
    it('setUser() / getUser()', () => {
      const store = getStore()
      store.setUser({
        name: 'test'
      })

      expect(store.getUser()).toEqual({
        name: 'test'
      })
    })
  })

  describe('device', () => {
    it('device has been initialized', () => {
      const store = getStore()

      expect(store.getDevice()).toBeDefined()
    })

    it('setDevice() / getDevice()', () => {
      const store = getStore()
      store.setDevice({
        browser: 'chrome'
      })

      expect(store.getDevice()).toEqual({
        browser: 'chrome'
      })
    })
  })

  describe('replayId', () => {
    it('setReplayId() / getReplayId()', () => {
      const store = getStore()

      expect(store.getReplayId()).toEqual('')

      store.setReplayId('testId')

      expect(store.getReplayId()).toEqual('testId')
    })
  })

  describe('breadcrumb', () => {
    it('addBreadcrumb() / getBreadcrumbs()', () => {
      const store = getStore()

      expect(store.getBreadcrumbs()).toHaveLength(0)

      store.addBreadcrumb({
        type: EventTypes.Click,
        data: 'testClickData'
      })

      expect(store.getBreadcrumbs()).toHaveLength(1)
      expect(store.getBreadcrumbs()[0]).toEqual({
        type: EventTypes.Click,
        data: 'testClickData'
      })
    })

    it('maxBreadcrumbs', () => {
      setStore(
        new Store({
          maxBreadcrumbs: 1
        })
      )
      const store = getStore()
      store.addBreadcrumb({
        type: EventTypes.Click,
        data: ''
      })
      store.addBreadcrumb({
        type: EventTypes.Click,
        data: ''
      })

      expect(store.getBreadcrumbs()).toHaveLength(1)
    })
  })
})
