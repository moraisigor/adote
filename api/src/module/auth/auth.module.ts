import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { NotifyModule } from '@/module/notify/notify.module'
import { UserModule } from '@/module/user/user.module'

import { AuthController } from './auth.controller'
import { AuthProvider } from './provider'
import { ExpireAuthProvider } from './provider/expire.auth.provider'
import { LockAuthProvider } from './provider/lock.auth.provider'
import { PhoneAuthProvider } from './provider/phone.auth.provider'
import { RenewAuthProvider } from './provider/renew.auth.provider'
import { TokenAuthProvider } from './provider/token.auth.provider'
import { VerifyAuthProvider } from './provider/verify.auth.provider'
import { TokenRenewStrategy } from './strategy/token.renew.strategy'
import { TokenStrategy } from './strategy/token.strategy'

@Module({
  imports: [
    NotifyModule,
    UserModule,
    // dependency
    JwtModule,
    PassportModule,
    CacheModule.register({
      ttl: 2 * 60 * 1000
    })
  ],
  providers: [
    AuthProvider,
    ExpireAuthProvider,
    LockAuthProvider,
    PhoneAuthProvider,
    RenewAuthProvider,
    TokenAuthProvider,
    TokenRenewStrategy,
    TokenStrategy,
    VerifyAuthProvider
  ],
  controllers: [AuthController]
})
export class AuthModule {}
