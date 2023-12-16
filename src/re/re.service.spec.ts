import { Test, TestingModule } from '@nestjs/testing'
import { ReService } from './re.service'

describe('ReService', () => {
  let service: ReService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReService]
    }).compile()

    service = module.get<ReService>(ReService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
