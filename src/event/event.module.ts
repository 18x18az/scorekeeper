import { Module, forwardRef } from '@nestjs/common'
import { EventService } from './event.service'
import { SeasonModule } from '../season/season.module'
import { ReModule } from '../re/re.module'
import { RegionModule } from '../region/region.module'
import { LocationModule } from '../location/location.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './event.entity'
import { EventResolver } from './event.resolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    ReModule,
    forwardRef(() => SeasonModule),
    RegionModule,
    LocationModule
  ],
  providers: [EventService, EventResolver],
  exports: [EventService]
})
export class EventModule {}
