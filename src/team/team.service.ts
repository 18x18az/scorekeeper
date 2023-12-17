import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { ReService } from '../re/re.service'
import { ProgramService } from '../program/program.service'
import { LocationResponse } from '../location/location.interface'
import { RegionService } from '../region/region.service'
import { FindTeamsArgs } from './dto/find-teams.args'
import { Team } from './team.entity'
import { Grade } from './dto/team.enums'
import { Event } from '../event/event.entity'
import { EventResponse } from '../event/dto/event.response'
import { SeasonService } from '../season/season.service'
import { EventService } from '../event/event.service'

interface TeamResponse {
  id: number
  number: string
  team_name: string
  organization: string
  location: LocationResponse
  registered: boolean
  grade: Grade
  robot_name: string | null
}

@Injectable()
export class TeamService {
  private readonly logger: Logger = new Logger(TeamService.name)
  constructor (
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    private readonly re: ReService,
    private readonly programService: ProgramService,
    private readonly regionService: RegionService,
    private readonly seasonService: SeasonService,
    private readonly eventService: EventService
  ) {}

  private async getTeam (program: number, number: string): Promise<Team> {
    const team = (await this.re.paginated<TeamResponse>('teams', { number: [number], program: [program] }))[0]

    this.logger.log(`Creating team ${team.number}`)

    const region = await this.regionService.createRegionIfNotExists({ name: team.location.region, country: { name: team.location.country } })

    const createdTeam = this.teamRepo.create({
      number: team.number,
      name: team.team_name,
      organization: team.organization,
      registered: team.registered,
      grade: team.grade,
      program: { id: program },
      region,
      reId: team.id,
      robotName: team.robot_name ?? undefined
    })

    return await this.teamRepo.save(createdTeam)
  }

  private async getEvents (team: Team): Promise<Event[]> {
    const reId = team.reId
    const programId = team.program.id
    const currentSeason = await this.seasonService.getCurrentSeason(programId)
    const resource = `teams/${reId}/events`
    const eventsToAdd = await this.re.paginated<EventResponse>(resource, { season: [currentSeason.reId] })

    const eventPromises = eventsToAdd.map(async (event) => await this.eventService.createEventIfNotExists(event))
    const events = await Promise.all(eventPromises)
    team.events = events
    await this.teamRepo.save(team)

    return team.events
  }

  async findOneBy (where: FindOptionsWhere<Team>): Promise<Team> {
    const result = await this.teamRepo.findOneBy(where)

    if (result !== null) {
      return result
    }

    const keys = Object.keys(where)

    if (keys.includes('number') && keys.includes('program')) {
      const { number, program } = where
      const programInfo = await this.programService.findOneBy(program as any)
      const programId = programInfo.reId
      const team = await this.getTeam(programId, number as string)
      return team
    }

    throw new NotFoundException('Team not found')
  }

  async findAll (args: FindTeamsArgs): Promise<Team[]> {
    return await this.teamRepo.findBy(args)
  }

  async findEvents (team: Team): Promise<Event[]> {
    const id = team.id

    const stored = await this.teamRepo.findOne({ where: { id }, relations: ['events', 'program'] })

    if (stored === null) {
      throw new NotFoundException('Team not found')
    }

    const events = stored.events

    if (events.length > 0) {
      return events
    }

    // Don't bother fetching events if the team isn't registered for the current season
    if (!stored.registered) {
      return []
    }

    this.logger.log(`Fetching events for team ${team.number}`)
    return await this.getEvents(stored)
  }
}
