import { Injectable } from '@nestjs/common'

import { ExpireAuthProvider } from './expire.auth.provider'
import { PhoneAuthProvider } from './phone.auth.provider'
import { RenewAuthProvider } from './renew.auth.provider'
import { VerifyAuthProvider } from './verify.auth.provider'

@Injectable()
export class AuthProvider {
  constructor(
    readonly phone: PhoneAuthProvider,
    readonly renew: RenewAuthProvider,
    readonly verify: VerifyAuthProvider,
    readonly expire: ExpireAuthProvider
  ) {}
}
