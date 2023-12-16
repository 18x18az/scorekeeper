import { Type } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

export function BaseResolver<T extends Type<unknown>> (classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    @Query((type) => [classRef], { name: `findAll${classRef.name}` })
    async findAll (): Promise<T[]> {
      return []
    }

    @Query((type) => classRef, { name: `findOne${classRef.name}` })
    async findOne (): Promise<T> {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return {} as T
    }
  }
  return BaseResolverHost
}
