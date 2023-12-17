import { registerEnumType } from '@nestjs/graphql'

export enum Grade {
  COLLEGe = 'College',
  HIGH_SCHOOL = 'High School',
  MIDDLE_SCHOOL = 'Middle School',
  ELEMENTARY_SCHOOL = 'Elementary School'
}

registerEnumType(Grade, {
  name: 'Grade'
})
