import { Injectable } from '@nestjs/common'

import { PhoneAuthProvider } from './phone.auth.provider'
import { RenewAuthProvider } from './renew.auth.provider'
import { VerifyAuthProvider } from './verify.auth.provider'

@Injectable()
export class AuthProvider {
  constructor(
    readonly phone: PhoneAuthProvider,
    readonly renew: RenewAuthProvider,
    readonly verify: VerifyAuthProvider
  ) {}
}
