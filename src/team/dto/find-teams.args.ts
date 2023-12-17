import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Grade } from './team.enums'

@ArgsType()
export class FindTeamsArgs {
  @Field(type => Grade, { nullable: true })
    grade: Grade

  @Field({ nullable: true })
    organization: string

  @Field(type => Int, { nullable: true })
    regionId: number

  @Field({ nullable: true })
    registered: boolean

  @Field(type => Int, { nullable: true })
    programId: number
}
