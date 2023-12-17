import { Args, Query, Resolver } from '@nestjs/graphql'
import { Team } from './team.entity'
import { TeamService } from './team.service'
import { FindTeamsArgs } from './dto/find-teams.args'

@Resolver(() => Team)
export class TeamResolver {
  constructor (private readonly service: TeamService) {}

  @Query(() => Team)
  async findTeamByNumber (@Args('number') number: string): Promise<Team> {
    return await this.service.findOneBy({ number, program: { code: 'VRC' } })
  }

  @Query(() => [Team])
  async findAllTeams (@Args() args: FindTeamsArgs): Promise<Team[]> {
    return await this.service.findAll(args)
  }
}
