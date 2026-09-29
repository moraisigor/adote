import { Injectable } from '@nestjs/common'

import { KeyAuthProvider } from './key.auth.provider'
import { PhoneAuthProvider } from './phone.auth.provider'
import { RenewAuthProvider } from './renew.auth.provider'
import { VerifyAuthProvider } from './verify.auth.provider'

@Injectable()
export class AuthProvider {
  constructor(
    readonly key: KeyAuthProvider,
    readonly phone: PhoneAuthProvider,
    readonly renew: RenewAuthProvider,
    readonly verify: VerifyAuthProvider
  ) {}
}
