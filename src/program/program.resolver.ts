import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ProgramService } from './program.service'
import { Program } from './program.entity'
import { BaseResolver } from '../utils/resolver'
import { Season } from '../season/season.entity'
import { SeasonService } from '../season/season.service'

@Resolver(() => Program)
export class ProgramResolver extends BaseResolver(Program) {
  constructor (
    private readonly service: ProgramService,
    private readonly seasonService: SeasonService
  ) {
    super()
  }

  @Query(returns => [Program])
  async programs (): Promise<Program[]> {
    return await this.service.findAll()
  }

  @Query(returns => Program)
  async program (@Args('id', { type: () => Int }) id: number): Promise<Program> {
    return await this.service.findOne(id)
  }

  @Query(returns => Program)
  async programByCode (@Args('code') code: string): Promise<Program> {
    return await this.service.findByCode(code)
  }

  @ResolveField(returns => [Season])
  async seasons (@Parent() program: Program): Promise<Season[]> {
    const { id } = program
    return await this.seasonService.findByProgram(id)
  }
}
