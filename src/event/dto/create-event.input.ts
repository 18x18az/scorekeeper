import { InputType } from '@nestjs/graphql'
import { EventLevel, EventType } from './event.enums'

@InputType()
export class CreateEventInput {
  reId: number
  sku: string
  name: string
  start: string
  end: string
  locationId: number
  regionId: number
  level: EventLevel
  ongoing: boolean
  awardsFinalized: boolean
  eventType: EventType | null
}
