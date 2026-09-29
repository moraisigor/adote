import type { UserDocument } from '@/module/user/repository/user.schema'

import type { Token } from './type/token'

export class AuthResponse {
  readonly id: string
  readonly phone: string

  constructor(user: UserDocument) {
    this.id = user.id
    this.phone = user.phone
  }
}

export class TokenResponse {
  constructor(
    readonly token: Token,
    readonly renew: Token
  ) {}
}
