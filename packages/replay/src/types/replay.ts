import { EventTypes } from '@gadow/types'

export interface ReplayOptions {
  events?: EventTypes[]
  maxEventsMatrix?: number
  unitMatrixLen?: number
}
