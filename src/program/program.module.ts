import { Module, forwardRef } from '@nestjs/common'
import { ProgramService } from './program.service'
import { ReModule } from '../re/re.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Program } from './program.entity'
import { ProgramResolver } from './program.resolver'
import { SeasonModule } from '../season/season.module'

@Module({
  imports: [ReModule,
    TypeOrmModule.forFeature([Program]),
    forwardRef(() => SeasonModule)
  ],
  providers: [ProgramService, ProgramResolver],
  exports: [ProgramService]
})
export class ProgramModule {}
