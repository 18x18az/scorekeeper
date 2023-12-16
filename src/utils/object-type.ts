import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericObject {
  @Field((type) => Int)
    id: number
}
