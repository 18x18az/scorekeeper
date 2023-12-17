import { Module } from '@nestjs/common'
import { TeamService } from './team.service'
import { ReModule } from '../re/re.module'

@Module({
  imports: [ReModule],
  providers: [TeamService]
})
export class TeamModule {}
