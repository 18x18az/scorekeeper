import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Grade, Team } from './team.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { ReService } from '../re/re.service'
import { ProgramService } from '../program/program.service'
import { LocationResponse } from '../location/location.interface'
import { RegionService } from '../region/region.service'

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
    private readonly regionService: RegionService
  ) {}

  async getTeam (program: number, number: string): Promise<Team> {
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
}
