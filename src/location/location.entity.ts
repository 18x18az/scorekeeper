import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import { GenericObject } from '../utils/object-type'
import { Event } from '../event/event.entity'
import { Team } from '../team/team.entity'

@Entity()
@ObjectType()
export class Location extends GenericObject {
  @Column()
  @Field()
    venue: string

  @Column({ unique: true })
  @Field()
    address: string

  @Column()
  @Field()
    city: string

  @Column()
  @Field()
    region: string

  @Column()
  @Field()
    postcode: string

  @Column()
  @Field()
    country: string

  @Column('decimal', { precision: 8, scale: 5 })
  @Field(type => Float)
    latitude: number

  @Column('decimal', { precision: 8, scale: 5 })
  @Field(type => Float)
    longitude: number

  @OneToMany(() => Event, event => event.location)
  @Field(type => [Event])
    events: Event[]
}
