import { Injectable, Logger } from '@nestjs/common'
import { SeasonService } from '../season/season.service'
import { Season } from '../season/season.entity'
import { ReService } from '../re/re.service'
import { RegionService } from '../region/region.service'
import { LocationService } from '../location/location.service'
import { Event } from './event.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateEventInput } from './dto/create-event.input'
import { FindEventsArgs } from './dto/find-events.args'
import { EventResponse } from './dto/event.response'

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

  async createEventIfNotExists (reInput: EventResponse): Promise<Event> {
    const existing = await this.eventRepo.findOneBy({ reId: reInput.id })

    if (existing !== null) {
      return existing
    }

    this.logger.log(`Creating event ${reInput.name}`)

    const regionName = reInput.location.region
    const country = reInput.location.country

    const regionId = (await this.region.createRegionIfNotExists({ country: { name: country }, name: regionName })).id
    const locationId = (await this.location.createIfNotExists(reInput.location)).id

    const eventCreate: CreateEventInput = {
      reId: reInput.id,
      sku: reInput.sku,
      name: reInput.name,
      start: reInput.start,
      end: reInput.end,
      locationId,
      regionId,
      level: reInput.level,
      ongoing: reInput.ongoing,
      awardsFinalized: reInput.awards_finalized,
      eventType: reInput.event_type
    }

    const newEvent = this.eventRepo.create(eventCreate)
    return await this.eventRepo.save(newEvent)
  }

  private async handleEvent (event: EventResponse): Promise<void> {
    const existing = await this.eventRepo.findOneBy({ reId: event.id })

    if (existing !== null) {
      return
    }

    this.logger.log(`Creating event ${event.name}`)

    const regionName = event.location.region
    const country = event.location.country

    const regionId = (await this.region.createRegionIfNotExists({ country: { name: country }, name: regionName })).id
    const locationId = (await this.location.createIfNotExists(event.location)).id

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
