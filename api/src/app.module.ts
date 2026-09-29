import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, RouterModule } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup'

import { AuthModule } from '@/module/auth/auth.module'
import { BreedModule } from '@/module/breed/breed.module'
import { ConfigurationModule } from '@/module/configuration/configuration.module'
import { FavModule } from '@/module/fav/fav.module'
import { HealthModule } from '@/module/health/health.module'
import { ImageModule } from '@/module/image/image.module'
import { LocationModule } from '@/module/location/location.module'
import { MessageModule } from '@/module/message/message.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PermissionModule } from '@/module/permission/permission.module'
import { PetModule } from '@/module/pet/pet.module'
import { PostModule } from '@/module/post/post.module'
import { UserModule } from '@/module/user/user.module'

import { isProduction } from '@/helper/env'

import { RepositoryConfigFactory } from './repository.config.factory'
import { RequestConfigFactory } from './request.config.factory'
import { RouteConfig } from './router.config.factory'

@Module({
  imports: [
    AuthModule,
    BreedModule,
    ConfigurationModule,
    FavModule,
    HealthModule,
    ImageModule,
    LocationModule,
    MessageModule,
    OrganizationModule,
    PermissionModule,
    PetModule,
    PostModule,
    UserModule,
    RouterModule.register(RouteConfig),
    // dependency
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENV}`,
      ignoreEnvFile: isProduction
    }),
    ThrottlerModule.forRootAsync({
      useClass: RequestConfigFactory
    }),
    MongooseModule.forRootAsync({
      useClass: RepositoryConfigFactory
    })
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: SentryGlobalFilter }
  ]
})
export class AppModule {}
