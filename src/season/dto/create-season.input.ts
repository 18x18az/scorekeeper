import { InputType } from '@nestjs/graphql'

@InputType()
export class CreateSeasonInput {
  name: string
  reId: number
  yearStart: number
  yearEnd: number
  isCurrent: boolean
}
