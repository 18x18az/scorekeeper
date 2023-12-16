import { Module } from '@nestjs/common'
import { SeasonService } from './season.service'
import { ReModule } from '../re/re.module'
import { ProgramModule } from '../program/program.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Season } from './season.entity'

@Module({
  imports: [ReModule, ProgramModule, TypeOrmModule.forFeature([Season])],
  providers: [SeasonService]
})
export class SeasonModule {}
