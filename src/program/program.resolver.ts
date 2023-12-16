import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { ProgramService } from './program.service'
import { Program } from './program.entity'

@Resolver()
export class ProgramResolver {
  constructor (private readonly service: ProgramService) {}

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
}
