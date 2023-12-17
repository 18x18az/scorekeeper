import { Injectable, Logger } from '@nestjs/common'
import { ReService } from '../re/re.service'
import { ProgramService } from '../program/program.service'
import { Season } from './season.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSeasonInput } from './dto/create-season.input'
import { Program } from '../program/program.entity'

interface SeasonResponse {
  id: number
  name: string
  years_start: number
  years_end: number
}

@Injectable()
export class SeasonService {
  private readonly logger: Logger = new Logger(SeasonService.name)

  constructor (
    private readonly re: ReService,
    private readonly programs: ProgramService,
    @InjectRepository(Season) private readonly seasonRepo: Repository<Season>
  ) {}

  async hydrateSeasons (): Promise<void> {
    await this.programs.hydratePrograms()
    this.logger.log('Checking for current seasons')
    const programs = await this.programs.findAll()

    for (const program of programs) {
      const { id } = program
      const existing = await this.seasonRepo.find({ where: { programId: id } })

      const current = existing.find(s => s.isCurrent)
      if (current !== undefined) {
        this.logger.log(`Current season for ${program.name} is ${current.name}`)
        continue
      }

      this.logger.log(`No current season for ${program.name}`)
      const currentSeason = (await this.re.paginated<SeasonResponse>('seasons', { active: true, program: [program.reId] }))[0]
      await this.create(program, { name: currentSeason.name, yearStart: currentSeason.years_start, yearEnd: currentSeason.years_end, reId: currentSeason.id, isCurrent: true })
      this.logger.log(`Created season ${currentSeason.name} for ${program.name}`)
    }
  }

  async create (program: Program, createSeasonInput: CreateSeasonInput): Promise<Season> {
    const newSeason = this.seasonRepo.create({ program, ...createSeasonInput })
    return await this.seasonRepo.save(newSeason)
  }

  async findAll (): Promise<Season[]> {
    return await this.seasonRepo.find()
  }

  async findOne (id: number): Promise<Season> {
    return await this.seasonRepo.findOneByOrFail({ id })
  }

  async findByProgram (programId: number): Promise<Season[]> {
    return await this.seasonRepo.find({ where: { programId } })
  }

  async findCurrent (): Promise<Season[]> {
    return await this.seasonRepo.find({ where: { isCurrent: true } })
  }

  async getCurrentSeason (programId: number): Promise<Season> {
    const current = await this.seasonRepo.findOneByOrFail({ isCurrent: true, programId })
    return current
  }
}
