import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { GenericObject } from '../utils/object-type'
import { Region } from '../region/region.entity'
import { Location } from '../location/location.entity'
import { Team } from '../team/team.entity'
import { EventLevel, EventType } from './dto/event.enums'

@ObjectType()
@Entity()
export class Event extends GenericObject {
  @Column()
  @Field()
    name: string

  @Column({ unique: true })
    reId: number

  @Column({ unique: true })
  @Field()
    sku: string

  @Column()
  @Field()
    start: Date

  @Column()
  @Field()
    end: Date

  @Column({ type: 'simple-enum', enum: EventLevel })
  @Field(type => EventLevel)
    level: EventLevel

  @Column()
  @Field()
    ongoing: boolean

  @Column()
  @Field()
    awardsFinalized: boolean

  @Column({ type: 'simple-enum', enum: EventType, nullable: true })
  @Field(type => EventType)
    eventType: EventType | null

  @Column()
  @Field(type => Int)
    regionId: number

  @ManyToOne(() => Region, region => region.events)
  @JoinColumn({ name: 'regionId' })
  @Field(type => Region)
    region: Region

  @Column()
  @Field(type => Int)
    locationId: number

  @ManyToOne(() => Location, location => location.events)
  @JoinColumn({ name: 'locationId' })
  @Field(type => Location)
    location: Location

  @ManyToMany(() => Team, team => team.events, { cascade: true })
  @JoinTable()
  @Field(type => [Team])
    teams: Team[]
}
