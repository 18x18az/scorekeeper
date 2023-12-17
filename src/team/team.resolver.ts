import { Args, Query, Resolver } from '@nestjs/graphql'
import { Team } from './team.entity'
import { BaseResolver } from '../utils/resolver'
import { TeamService } from './team.service'

@Resolver(() => Team)
export class TeamResolver extends BaseResolver(Team) {
  constructor (private readonly service: TeamService) {
    super()
  }

  @Query(() => Team)
  async findTeamByNumber (@Args('number') number: string): Promise<Team> {
    return await this.service.findOneBy({ number, program: { code: 'VRC' } })
  }
}
