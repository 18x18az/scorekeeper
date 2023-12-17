import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLocationInput } from './dto/create-location.input'
import { Location } from './location.entity'
import { LocationResponse } from './location.interface'

@Injectable()
export class LocationService {
  private readonly logger: Logger = new Logger(LocationService.name)
  constructor (
    @InjectRepository(Location) private readonly locationRepo: Repository<Location>
  ) {}

  async findAll (): Promise<Location[]> {
    return await this.locationRepo.find()
  }

  async findOne (id: number): Promise<Location> {
    return await this.locationRepo.findOneByOrFail({ id })
  }

  async findByAddress (address: string): Promise<Location> {
    return await this.locationRepo.findOneByOrFail({ address })
  }

  async createIfNotExists (createLocationInput: LocationResponse): Promise<Location> {
    const location = await this.locationRepo.findOneBy({ address: createLocationInput.address_1 })

    if (location !== null) {
      return location
    }

    this.logger.log(`Creating location ${createLocationInput.address_1}`)

    const formatted: CreateLocationInput = {
      address: createLocationInput.address_1,
      city: createLocationInput.city,
      country: createLocationInput.country,
      latitude: createLocationInput.coordinates.lat,
      longitude: createLocationInput.coordinates.lon,
      venue: createLocationInput.venue,
      region: createLocationInput.region,
      postcode: createLocationInput.postcode
    }

    try {
      const newLocation = this.locationRepo.create(formatted)
      return await this.locationRepo.save(newLocation)
    } catch (error) {
      if (error.message.includes('Violation of UNIQUE KEY constraint') === true) {
        return await this.locationRepo.findOneByOrFail({ address: createLocationInput.address_1 })
      }
      throw error
    }
  }
}
