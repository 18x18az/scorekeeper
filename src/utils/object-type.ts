import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class GenericObject {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
    id: number
}
