import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Program } from '../program/program.entity'

@Entity()
@ObjectType()
export class Season {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
    id: number

  @Column()
  @Field()
    name: string

  @Column()
    reId: number

  @Column()
  @Field(type => Int)
    yearStart: number

  @Column()
  @Field(type => Int)
    yearEnd: number

  @ManyToOne(() => Program, program => program.seasons)
  @JoinColumn({ name: 'programId' })
  @Field(type => Program)
    program: Program

  @Column()
  @Field()
    isCurrent: boolean
}
