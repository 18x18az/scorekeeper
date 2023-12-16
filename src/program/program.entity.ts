import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Season } from '../season/season.entity'

@Entity()
@ObjectType()
export class Program {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
    id: number

  @Column()
    reId: number

  @Column()
  @Field()
    name: string

  @Column()
  @Field()
    code: string

  @OneToMany(() => Season, season => season.program)
  @Field(type => [Season])
    seasons: Season[]
}
