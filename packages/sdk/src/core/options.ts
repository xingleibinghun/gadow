import { Options as IOptions } from '../types'

export class Options {
  dsn: Options['dsn']
  apiToken: Options['apiToken']

  bindModel(options) {
    if (!validateOptions(options)) return this

    const { dsn, apiToken } = options
    this.dsn = dsn
    this.apiToken = apiToken

    return this
  }
}

/**
 *  TODO 引入 ajv 等库做校验
 * @param options
 */
const validateOptions = (options: IOptions) => {
  if (!options.dsn) {
    console.error('{dsn} cannot be empty')
    return false
  } else if (!options.apiToken) {
    console.error('{apiToken} cannot be empty')
    return false
  }
  return true
}

export const options = new Options()
