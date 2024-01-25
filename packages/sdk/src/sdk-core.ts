import { Options } from './types'
import { options, transport as transportInstance, enhanceInit } from './core'
import { eventEmitter } from './event'
import { record } from './record'

export { setUser, clearUser, transportSend as transport } from './core'
export { captureException, captureExceptionWithType } from './exception'

export const init = (opts: Options) => {
  options.bindModel(opts)
  transportInstance.bindModel(opts)
  enhanceInit()
  eventEmitter.init()
  if (opts.record) record.init()
}
