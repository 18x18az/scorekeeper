import { Module } from '@nestjs/common'
import { ProgramService } from './program.service'
import { ReModule } from '../re/re.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Program } from './program.entity'
import { ProgramResolver } from './program.resolver'

@Module({
  imports: [ReModule, TypeOrmModule.forFeature([Program])],
  providers: [ProgramService, ProgramResolver],
  exports: [ProgramService]
})
export class ProgramModule {}
