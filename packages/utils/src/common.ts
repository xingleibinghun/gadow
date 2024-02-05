import { ErrorException } from '@gadow/types'
import { v4 as uuidv4 } from 'uuid'
import ErrorStackParser from 'error-stack-parser'

export const enhance = (source: any, prop: string, enhancedFn: Function): void => {
  if (!source || !(prop in source) || typeof source[prop] !== 'function') return
  source[prop] = enhancedFn(source[prop])
}

export const getInternalPluginName = (name: string): string => {
  return `Gadow_${String(name).toLowerCase()}`
}

export const generateId = uuidv4

export const hasProperty = (obj: object, key: string): boolean =>
  Object.hasOwnProperty.call(obj, key)

export const deduplicateArray = (arr: unknown[]) => {
  return [...new Set(arr)]
}

export const getErrorInfo = (err?: Error | ErrorEvent): ErrorException => {
  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: ErrorStackParser.parse(err)
    }
  } else if (err instanceof ErrorEvent) {
    return {
      ...(getErrorInfo(err.error) as ErrorException),
      // 一些特殊场景下 ErrorEvent.error.stack 错误栈信息太少，所以补充个错误顶层的 filename
      filename: err.filename
    }
  }

  return {
    message: String(err)
  }
}
