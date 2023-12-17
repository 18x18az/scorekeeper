import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { RegionService } from './region.service'
import { Country } from './country.entity'
import { Region } from './region.entity'

@Resolver()
export class RegionResolver {
  constructor (private readonly regionService: RegionService) {}

  @Query(returns => [Country])
  async countries (): Promise<Country[]> {
    return await this.regionService.findAllCountries()
  }

  @Query(returns => [Region])
  async regions (): Promise<Region[]> {
    return await this.regionService.findAllRegions()
  }

  @Query(returns => Country)
  async country (@Args('id', { type: () => Int }) id: number): Promise<Country> {
    return await this.regionService.findOneCountry(id)
  }

  @Query(returns => Country)
  async countryByName (@Args('name') name: string): Promise<Country> {
    return await this.regionService.findCountryByName(name)
  }
}
