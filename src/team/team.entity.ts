import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, Unique } from 'typeorm'
import { GenericObject } from '../utils/object-type'
import { Region } from '../region/region.entity'
import { Program } from '../program/program.entity'
import { Event } from '../event/event.entity'
import { Grade } from './dto/team.enums'

@ObjectType()
@Entity()
@Unique(['number', 'program'])
export class Team extends GenericObject {
  @Column({ unique: true })
    reId: number

  @Column()
  @Field()
    number: string

  @Column()
  @Field()
    name: string

  @Column({ nullable: true })
  @Field({ nullable: true })
    robotName?: string

  @Column()
  @Field()
    organization: string

  @Column()
  @Field(() => Int)
    regionId: number

  @ManyToOne(() => Region, region => region.teams)
  @JoinColumn({ name: 'regionId' })
  @Field(type => Region)
    region: Region

  @Column()
  @Field()
    registered: boolean

  @ManyToOne(() => Program, program => program.teams)
  @JoinColumn({ name: 'programId' })
  @Field(type => Program)
    program: Program

  @Column({ type: 'simple-enum', enum: Grade })
  @Field(type => Grade)
    grade: Grade

  @ManyToMany(() => Event, event => event.teams)
  @Field(type => [Event])
    events: Event[]
}
