import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { Region } from './region.entity'
import { GenericObject } from '../utils/object-type'

@Entity()
@ObjectType()
export class Country extends GenericObject {
  @Column({ unique: true })
  @Field()
    name: string

  @OneToMany(() => Region, region => region.country)
  @Field(type => [Region], { nullable: true })
    regions?: Region[]
}
