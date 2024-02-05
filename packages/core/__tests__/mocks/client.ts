import { Options, ClientOptions } from '@gadow/types'
import { global } from '@gadow/utils'
import { BaseClient } from '../../src'
import { transport } from './transport'

interface TestClientOptions extends ClientOptions {}

export class TestClient extends BaseClient<TestClientOptions> {
  constructor(options: TestClientOptions) {
    super(options)
  }

  getPlugins() {
    return this.plugins
  }
}

export const init = (opts: Options) => {
  const newOpts: TestClientOptions = {
    ...opts,
    transport: opts.transport || transport
  }
  const client = new TestClient(newOpts)
  setClient(client)
}

export const setClient = (client: TestClient) => {
  if (!global.__Gadow) {
    global.__Gadow = {
      client
    }
  } else {
    global.__Gadow.client = client
  }
}

export const getDefaultClientOptions = (
  options?: Partial<TestClientOptions>
): TestClientOptions =>
  ({
    plugins: [],
    transport,
    ...options
  } as TestClientOptions)
