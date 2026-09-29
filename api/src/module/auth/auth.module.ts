import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { MessageModule } from '@/module/message/message.module'
import { UserModule } from '@/module/user/user.module'

import { AuthController } from './auth.controller'
import { PermissionGuard } from './guard/permission.guard'
import { TokenGuard } from './guard/token.guard'
import { AuthProvider } from './provider'
import { KeyAuthProvider } from './provider/key.auth.provider'
import { PhoneAuthProvider } from './provider/phone.auth.provider'
import { RenewAuthProvider } from './provider/renew.auth.provider'
import { VerifyAuthProvider } from './provider/verify.auth.provider'
import { BasicStrategy } from './strategy/basic.strategy'
import { KeyStrategy } from './strategy/key.strategy'
import { TokenRenewStrategy } from './strategy/token.renew.strategy'
import { TokenStrategy } from './strategy/token.strategy'

@Module({
  imports: [
    UserModule,
    MessageModule,
    // dependency
    JwtModule,
    PassportModule,
    CacheModule.register({
      ttl: 2 * 60 * 1000
    })
  ],
  providers: [
    AuthProvider,
    KeyAuthProvider,
    PhoneAuthProvider,
    RenewAuthProvider,
    VerifyAuthProvider,
    KeyStrategy,
    BasicStrategy,
    TokenStrategy,
    TokenRenewStrategy,
    { provide: APP_GUARD, useClass: TokenGuard },
    { provide: APP_GUARD, useClass: PermissionGuard }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
