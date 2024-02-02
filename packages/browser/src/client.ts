import { BaseClient } from '@sohey/core'
import { BrowserClientOptions } from './types'

export class BrowserClient extends BaseClient<BrowserClientOptions> {
  constructor(options: BrowserClientOptions) {
    super(options)
  }
}
