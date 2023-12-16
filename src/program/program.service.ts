import { Injectable, Logger } from '@nestjs/common'
import { ReService } from '../re/re.service'
import { Program } from './program.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateProgramInput } from './dto/create-program.input'
import { Repository } from 'typeorm'

const SUPPORTED_PROGRAMS = ['VRC', 'VEXU']

interface ProgramResponse {
  id: number
  abbr: string
  name: string
}

interface ProgramsResponse {
  data: ProgramResponse[]
}

@Injectable()
export class ProgramService {
  private readonly logger: Logger = new Logger(ProgramService.name)

  constructor (
    @InjectRepository(Program) private readonly programRepo: Repository<Program>,
    private readonly re: ReService
  ) {}

  async hydratePrograms (): Promise<void> {
    const existing = await this.programRepo.find()

    // check if we have all the programs we need
    const missing = SUPPORTED_PROGRAMS.filter(p => existing.find((program: Program) => (program.code === p)) === undefined)

    if (missing.length === 0) {
      this.logger.log('All supported programs are present')
      return
    }

    this.logger.log(`Missing programs: ${missing.join(', ')}`)
    const allPrograms = (await this.re.getRequest<ProgramsResponse>('programs')).data

    for (const program of allPrograms) {
      if (missing.includes(program.abbr)) {
        this.logger.log(`Creating program ${program.name}`)
        await this.create({ code: program.abbr, name: program.name, reId: program.id })
      }
    }
  }

  async create (createProgramInput: CreateProgramInput): Promise<Program> {
    const newProgram = this.programRepo.create(createProgramInput)
    return await this.programRepo.save(newProgram)
  }

  async findAll (): Promise<Program[]> {
    return await this.programRepo.find()
  }

  async findOne (id: number): Promise<Program> {
    return await this.programRepo.findOneByOrFail({ id })
  }

  async findByCode (code: string): Promise<Program> {
    return await this.programRepo.findOneByOrFail({ code })
  }
}
