import { Injectable, Logger } from '@nestjs/common'
import { Country } from './country.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCountryInput } from './dto/create-country.input'
import { Region } from './region.entity'
import { CreateRegionInput } from './dto/create-region.input'

@Injectable()
export class RegionService {
  private readonly logger: Logger = new Logger(RegionService.name)

  constructor (
    @InjectRepository(Country) private readonly countryRepo: Repository<Country>,
    @InjectRepository(Region) private readonly regionRepo: Repository<Region>
  ) {}

  async findAllCountries (): Promise<Country[]> {
    return await this.countryRepo.find()
  }

  async findAllRegions (): Promise<Region[]> {
    return await this.regionRepo.find()
  }

  async findOneCountry (id: number): Promise<Country> {
    return await this.countryRepo.findOneByOrFail({ id })
  }

  async findOneRegion (id: number): Promise<Region> {
    return await this.regionRepo.findOneByOrFail({ id })
  }

  async findCountryByName (name: string): Promise<Country> {
    return await this.countryRepo.findOneByOrFail({ name })
  }

  async findRegionByName (name: string): Promise<Region> {
    return await this.regionRepo.findOneByOrFail({ name })
  }

  async createCountry (createCountryInput: CreateCountryInput): Promise<Country> {
    this.logger.log(`Creating country ${createCountryInput.name}`)
    const newCountry = this.countryRepo.create(createCountryInput)
    return await this.countryRepo.save(newCountry)
  }

  async createRegion (createRegionInput: CreateRegionInput): Promise<Region> {
    this.logger.log(`Creating region ${createRegionInput.name} in country ${createRegionInput.country.name}`)

    let country = await this.countryRepo.findOneBy({ name: createRegionInput.country.name })
    if (country === null) {
      this.logger.log(`Country ${createRegionInput.country.name} does not exist, creating it`)
      country = await this.createCountry(createRegionInput.country)
    }

    const newRegion = this.regionRepo.create({ ...createRegionInput, country })
    return await this.regionRepo.save(newRegion)
  }
}
