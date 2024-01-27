import { Options as IOptions } from '../types'

export class Options {
  dsn: IOptions['dsn'] = ''
  apiToken: IOptions['apiToken'] = ''
  record: IOptions['record'] = false

  bindModel(options: IOptions) {
    if (!validateOptions(options)) return this

    const { dsn, apiToken, record } = options
    this.dsn = dsn
    this.apiToken = apiToken
    this.record = Boolean(record)

    return this
  }
}

/**
 *  TODO 引入 ajv 等库做校验
 * @param options
 */
const validateOptions = (options: IOptions) => {
  if (!options.dsn) {
    console.error('`dsn` cannot be empty')
    return false
  } else if (!options.apiToken) {
    console.error('`apiToken` cannot be empty')
    return false
  }
  return true
}

export const options = new Options()
