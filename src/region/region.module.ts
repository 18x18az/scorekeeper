import { Module } from '@nestjs/common'
import { RegionResolver } from './regin.resolver'
import { RegionService } from './region.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Country } from './country.entity'
import { Region } from './region.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Country, Region])],
  providers: [RegionResolver, RegionService],
  exports: [RegionService]
})
export class RegionModule {}
