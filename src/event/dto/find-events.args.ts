import { ArgsType, Field, Int } from '@nestjs/graphql'
import { EventLevel, EventType } from './event.enums'

@ArgsType()
export class FindEventsArgs {
  @Field((type) => EventLevel, { nullable: true })
    eventLevel: EventLevel

  @Field({ nullable: true })
    name: string

  @Field({ nullable: true })
    ongoing: boolean

  @Field({ nullable: true })
    awardsFinalized: boolean

  @Field((type) => EventType, { nullable: true })
    eventType: EventType

  @Field((type) => Int, { nullable: true })
    regionId: number

  @Field((type) => Int, { nullable: true })
    locationId: number
}
