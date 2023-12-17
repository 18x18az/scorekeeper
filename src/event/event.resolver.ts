import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { EventService } from './event.service'
import { Event } from './event.entity'
import { FindEventsArgs } from './dto/find-events.args'
import { LocationService } from '../location/location.service'
import { Location } from '../location/location.entity'
import { Region } from '../region/region.entity'
import { RegionService } from '../region/region.service'
import { Team } from '../team/team.entity'

@Resolver(() => Event)
export class EventResolver {
  constructor (
    private readonly eventService: EventService,
    private readonly locationService: LocationService,
    private readonly regionService: RegionService
  ) {
  }

  @Query(() => [Event])
  async findAllEvents (@Args() args: FindEventsArgs): Promise<Event[]> {
    return await this.eventService.findAll(args)
  }

  @ResolveField(() => Location)
  async location (@Parent() event: Event): Promise<Location> {
    return await this.locationService.findOne(event.locationId)
  }

  @ResolveField(() => Region)
  async region (@Parent() event: Event): Promise<Region> {
    return await this.regionService.findOneRegion(event.regionId)
  }

  @ResolveField(() => [Team])
  async teams (@Parent() event: Event): Promise<Team[]> {
    return [] // TODO: Implement this
    // return await this.eventService.findTeams(event.id)
  }
}
