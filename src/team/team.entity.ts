import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, Unique } from 'typeorm'
import { GenericObject } from '../utils/object-type'
import { Region } from '../region/region.entity'
import { Program } from '../program/program.entity'
import { Location } from '../location/location.entity'
import { Event } from '../event/event.entity'

export enum Grade {
  COLLEGe = 'College',
  HIGH_SCHOOL = 'High School',
  MIDDLE_SCHOOL = 'Middle School',
  ELEMENTARY_SCHOOL = 'Elementary School'
}

registerEnumType(Grade, {
  name: 'Grade'
})

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

  @ManyToOne(() => Region, region => region.teams)
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
