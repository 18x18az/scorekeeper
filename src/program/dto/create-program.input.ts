import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateProgramInput {
  @Field()
    name: string

  @Field()
    code: string

  @Field(type => Int)
    reId: number
}
