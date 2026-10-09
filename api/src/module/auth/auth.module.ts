import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { NotifyModule } from '@/module/notify/notify.module'
import { PermissionModule } from '@/module/permission/permission.module'
import { UserModule } from '@/module/user/user.module'

import { AuthController } from './auth.controller'
import { OrganizationPermissionGuard } from './guard/organization.permission.guard'
import { PermissionGuard } from './guard/permission.guard'
import { TokenGuard } from './guard/token.guard'
import { AuthProvider } from './provider'
import { ExpireAuthProvider } from './provider/expire.auth.provider'
import { PhoneAuthProvider } from './provider/phone.auth.provider'
import { RenewAuthProvider } from './provider/renew.auth.provider'
import { VerifyAuthProvider } from './provider/verify.auth.provider'
import { BasicStrategy } from './strategy/basic.strategy'
import { TokenRenewStrategy } from './strategy/token.renew.strategy'
import { TokenStrategy } from './strategy/token.strategy'

@Module({
  imports: [
    UserModule,
    NotifyModule,
    PermissionModule,
    // dependency
    JwtModule,
    PassportModule,
    CacheModule.register({
      ttl: 2 * 60 * 1000
    })
  ],
  providers: [
    AuthProvider,
    PhoneAuthProvider,
    RenewAuthProvider,
    VerifyAuthProvider,
    ExpireAuthProvider,
    BasicStrategy,
    TokenStrategy,
    TokenRenewStrategy,
    { provide: APP_GUARD, useClass: TokenGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    { provide: APP_GUARD, useClass: OrganizationPermissionGuard }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
