import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Country } from './country.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Region {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
    id: number

  @Column()
  @Field()
    name: string

  @ManyToOne(() => Country, country => country.regions)
  @Field(type => Country)
    country: Country
}
