import { EventTypes } from '@sohey/shared'
import { HANDLES } from './handles'

export class Exception {
  captureException(err: Error | ErrorEvent) {
    HANDLES[EventTypes.Error](err)
  }

  captureExceptionWithType(type: EventTypes, err: Error | ErrorEvent) {
    if (!(type in HANDLES)) {
      console.error('`type` is incorrect')
    }
    // @ts-ignore
    typeof HANDLES[type] === 'function' && HANDLES[type](err)
  }
}

export const exception = new Exception()

export const captureException = (err: Error | ErrorEvent) =>
  exception.captureException(err)
export const captureExceptionWithType = (
  type: EventTypes,
  err: Error | ErrorEvent
) => exception.captureExceptionWithType(type, err)
