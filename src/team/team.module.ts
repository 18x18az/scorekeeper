import { Module } from '@nestjs/common'
import { TeamService } from './team.service'
import { ReModule } from '../re/re.module'
import { TeamResolver } from './team.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Team } from './team.entity'
import { ProgramModule } from '../program/program.module'
import { RegionModule } from '../region/region.module'

@Module({
  imports: [ReModule,
    TypeOrmModule.forFeature([Team]),
    ProgramModule,
    RegionModule
  ],
  providers: [TeamService, TeamResolver]
})
export class TeamModule {}
