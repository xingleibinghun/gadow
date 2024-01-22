import { UAParser } from 'ua-parser-js'
import { DeviceInfo } from '../types'

export class Device {
  device: DeviceInfo

  getDevice() {
    return this.device || (this.device = new UAParser().getResult())
  }
}

export const device = new Device()
