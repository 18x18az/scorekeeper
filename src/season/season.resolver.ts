import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Season } from './season.entity'
import { SeasonService } from './season.service'
import { Program } from '../program/program.entity'
import { ProgramService } from '../program/program.service'
import { BaseResolver } from '../utils/resolver'

@Resolver(() => Season)
export class SeasonResolver extends BaseResolver(Season) {
  constructor (
    private readonly service: SeasonService,
    private readonly programService: ProgramService
  ) {
    super()
  }

  @Query(returns => [Season])
  async seasons (): Promise<Season[]> {
    return await this.service.findAll()
  }

  @Query(returns => Season)
  async season (@Args('id', { type: () => Int }) id: number): Promise<Season> {
    return await this.service.findOne(id)
  }

  @ResolveField(returns => Program)
  async program (@Parent() season: Season): Promise<Program> {
    return await this.programService.findOne(season.programId)
  }
}
