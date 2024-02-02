import { EventTypes } from '@sohey/types'

export interface ReplayOptions {
  events?: EventTypes[]
  maxEventsMatrix?: number
  unitMatrixLen?: number
}
