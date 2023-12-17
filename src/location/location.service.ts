import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLocationInput } from './dto/create-location.input'
import { Location } from './location.entity'

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

  async createIfNotExists (createLocationInput: CreateLocationInput): Promise<Location> {
    const location = await this.locationRepo.findOneBy({ address: createLocationInput.address })

    if (location !== null) {
      return location
    }

    this.logger.log(`Creating location ${createLocationInput.address}`)
    const newLocation = this.locationRepo.create(createLocationInput)
    return await this.locationRepo.save(newLocation)
  }
}
