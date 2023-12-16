import { Module, forwardRef } from '@nestjs/common'
import { SeasonService } from './season.service'
import { ReModule } from '../re/re.module'
import { ProgramModule } from '../program/program.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Season } from './season.entity'
import { SeasonResolver } from './season.resolver'

@Module({
  imports: [ReModule,
    ProgramModule, TypeOrmModule.forFeature([Season]),
    forwardRef(() => ProgramModule)
  ],
  providers: [SeasonService, SeasonResolver],
  exports: [SeasonService]
})
export class SeasonModule {}
