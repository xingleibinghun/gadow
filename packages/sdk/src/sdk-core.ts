import { Options } from './types'
import { options, transport as transportInstance } from './core'
import { eventEmitter } from './event'

export { setUser, clearUser, transportSend as transport } from './core'
export { captureException, captureExceptionWithType } from './exception'

export const init = (opts: Options) => {
  options.bindModel(opts)
  transportInstance.bindModel(opts)
  eventEmitter.init()
}
