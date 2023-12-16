import { Field, InputType } from '@nestjs/graphql'
import { CreateCountryInput } from './create-country.input'

@InputType()
export class CreateRegionInput {
  @Field()
    country: CreateCountryInput

  @Field()
    name: string
}
