import { Field, ObjectType } from '@nestjs/graphql'
import { Country } from './country.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { GenericObject } from '../utils/object-type'
import { Event } from '../event/event.entity'
import { Team } from '../team/team.entity'

@Entity()
@ObjectType()
export class Region extends GenericObject {
  @Column({ unique: true })
  @Field()
    name: string

  @ManyToOne(() => Country, country => country.regions)
  @Field(type => Country)
    country: Country

  @OneToMany(() => Event, event => event.region)
  @Field(type => [Event])
    events: Event[]

  @OneToMany(() => Team, team => team.region)
  @Field(type => [Team])
    teams: Team[]
}
