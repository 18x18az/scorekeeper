import { Test, TestingModule } from '@nestjs/testing'
import { RegionResolver } from './region.resolver'

describe('RegionResolver', () => {
  let resolver: RegionResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionResolver]
    }).compile()

    resolver = module.get<RegionResolver>(RegionResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
