import { ErrorException } from '@sohey/shared'
import ErrorStackParser from 'error-stack-parser'

/**
 * 获取错误信息
 * @param err
 */
export const getErrorInfo = (
  err: Error | ErrorEvent | unknown
): ErrorException => {
  if (!err) return

  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: ErrorStackParser.parse(err)
    }
  } else if (err instanceof ErrorEvent) {
    return {
      ...getErrorInfo(err.error),
      // 一些特殊场景下 ErrorEvent.error.stack 错误栈信息太少，所以补充个错误顶层的 filename
      filename: err.filename
    }
  }

  return {
    message: String(err)
  }
}
