import { Module } from '@nestjs/common'
import { EventModule } from './event/event.module'
import { RegionModule } from './region/region.module'
import { TeamModule } from './team/team.module'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { SeasonModule } from './season/season.module'
import { ReModule } from './re/re.module'
import { ProgramModule } from './program/program.module'
import { LocationModule } from './location/location.module'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'

@Module({
  imports: [
    EventModule,
    RegionModule,
    TeamModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cache: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '10225'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'dev',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
        ssl: true,
        retryWrites: false,
        cache: true
      })
    }),
    SeasonModule,
    ReModule,
    ProgramModule,
    LocationModule
  ]
})
export class AppModule {}
