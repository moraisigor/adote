import { CacheModule } from '@nestjs/cache-manager'
import { ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { AuthModule } from '@/module/auth/auth.module'
import { BreedModule } from '@/module/breed/breed.module'
import { ConfigurationModule } from '@/module/configuration/configuration.module'
import { FavModule } from '@/module/fav/fav.module'
import { HealthModule } from '@/module/health/health.module'
import { LocationModule } from '@/module/location/location.module'
import { MessageModule } from '@/module/message/message.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PermissionModule } from '@/module/permission/permission.module'
import { PetModule } from '@/module/pet/pet.module'
import { PostModule } from '@/module/post/post.module'
import { UserModule } from '@/module/user/user.module'

import { Scenario } from './scenario'
import { RouteConfig } from '@/router.config.factory'

export class Spec {
  constructor(
    private readonly repository: MongoMemoryServer,
    readonly scenario: Scenario,
    readonly application: NestFastifyApplication
  ) {}

  public static build = async () => {
    const repository = await MongoMemoryServer.create()

    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        BreedModule,
        ConfigurationModule,
        FavModule,
        HealthModule,
        LocationModule,
        MessageModule,
        OrganizationModule,
        PermissionModule,
        PetModule,
        PostModule,
        UserModule,
        RouterModule.register(RouteConfig),
        // dependency
        JwtModule,
        PassportModule,
        CacheModule.register({
          ttl: 2 * 60 * 1000
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test'
        }),
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: repository.getUri()
          })
        })
      ]
    }).compile()

    const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    application.useGlobalPipes(new ValidationPipe({ transform: true }))

    const scenario = new Scenario(application)

    return new Spec(repository, scenario, application)
  }

  async start() {
    await this.application.init()
    await this.application.getHttpAdapter().getInstance().ready()
  }

  async stop() {
    await this.repository.stop()
    await this.application.close()
  }
}
