import { registerEnumType } from '@nestjs/graphql'

export enum EventLevel {
  WORLD = 'World',
  NATIONAL = 'National',
  REGIONAL = 'Regional',
  STATE = 'State',
  SIGNATURE = 'Signature',
  OTHER = 'Other'
}

export enum EventType {
  TOURNAMENT = 'tournament',
  LEAGUE = 'league',
  WORKSHOP = 'workshop',
  VIRTUAL = 'virtual',
}

registerEnumType(EventLevel, {
  name: 'EventLevel'
})

registerEnumType(EventType, {
  name: 'EventType'
})
