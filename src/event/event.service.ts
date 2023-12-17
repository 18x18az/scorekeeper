import { Injectable, Logger } from '@nestjs/common'
import { SeasonService } from '../season/season.service'
import { Season } from '../season/season.entity'
import { ReService } from '../re/re.service'
import { LocationResponse } from '../location/location.interface'
import { RegionService } from '../region/region.service'
import { LocationService } from '../location/location.service'
import { Event } from './event.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateEventInput } from './dto/create-event.input'
import { FindEventsArgs } from './dto/find-events.args'
import { EventLevel, EventType } from './dto/event.enums'

interface EventResponse {
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
@Injectable()
export class EventService {
  private readonly logger: Logger = new Logger(EventService.name)

  constructor (
    private readonly seasons: SeasonService,
    private readonly re: ReService,
    private readonly region: RegionService,
    private readonly location: LocationService,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>
  ) {}

  private async handleEvent (event: EventResponse): Promise<void> {
    const existing = await this.eventRepo.findOneBy({ reId: event.id })

    if (existing !== null) {
      return
    }

    this.logger.log(`Creating event ${event.name}`)

    const regionName = event.location.region
    const country = event.location.country

    const regionId = (await this.region.createRegionIfNotExists({ country: { name: country }, name: regionName })).id
    const locationId = (await this.location.createIfNotExists({
      venue: event.location.venue,
      address: event.location.address_1,
      city: event.location.city,
      region: regionName,
      postcode: event.location.postcode,
      country,
      latitude: event.location.coordinates.lat,
      longitude: event.location.coordinates.lon
    })).id

    const eventCreate: CreateEventInput = {
      reId: event.id,
      sku: event.sku,
      name: event.name,
      start: event.start,
      end: event.end,
      locationId,
      regionId,
      level: event.level,
      ongoing: event.ongoing,
      awardsFinalized: event.awards_finalized,
      eventType: event.event_type
    }

    const newEvent = this.eventRepo.create(eventCreate)
    await this.eventRepo.save(newEvent)
  }

  private async getEvents (season: Season): Promise<void> {
    this.logger.log(`Getting events for ${season.name}`)
    const events = await this.re.paginated<EventResponse>('events', { season: [season.reId] })
    await this.handleEvent(events[8])
  }

  async onApplicationBootstrap (): Promise<void> {
    await this.seasons.hydrateSeasons()
    const currentSeasons = await this.seasons.findCurrent()

    await this.getEvents(currentSeasons[0])
    // for (const season of currentSeasons) {
    //   await this.getEvents(season)
    // }
  }

  async findAll (args: FindEventsArgs): Promise<Event[]> {
    return await this.eventRepo.findBy(args)
  }
}
