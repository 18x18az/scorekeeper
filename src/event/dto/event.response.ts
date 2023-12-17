import { LocationResponse } from '../../location/location.interface'
import { EventLevel, EventType } from './event.enums'

export interface EventResponse {
  id: number
  sku: string
  name: string
  start: string
  end: string
  location: LocationResponse
  level: EventLevel
  ongoing: boolean
  awards_finalized: boolean
  event_type: EventType | null
}
