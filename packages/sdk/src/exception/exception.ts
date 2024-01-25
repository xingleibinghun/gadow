import { ExceptionTypes } from '@sohey/shared'
import { HANDLES } from './handles'

export class Exception {
  captureException(err) {
    HANDLES[ExceptionTypes.Error](err)
  }

  captureExceptionWithType(type, err) {
    if (!HANDLES[type]) {
      console.error('`type` is incorrect')
    }
    HANDLES[type]?.(err)
  }
}

export const exception = new Exception()

export const captureException = (...args) => exception.captureException(...args)
export const captureExceptionWithType = (...args) =>
  exception.captureExceptionWithType(...args)
