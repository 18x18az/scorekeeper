import { Module } from '@nestjs/common'
import { ReService } from './re.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [ReService],
  exports: [ReService]
})
export class ReModule {}
