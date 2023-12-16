import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Region } from './region.entity'

@Entity()
@ObjectType()
export class Country {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
    id: number

  @Column()
  @Field()
    name: string

  @OneToMany(() => Region, region => region.country)
  @Field(type => [Region], { nullable: true })
    regions?: Region[]
}
