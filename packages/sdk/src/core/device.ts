import { UAParser } from 'ua-parser-js'

export class Device {
  device: Record<string, any> = {}

  getDevice() {
    return this.device || (this.device = new UAParser().getResult())
  }
}

export const device = new Device()
