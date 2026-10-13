import type { Token } from './type/token'

export class TokenResponse {
  constructor(
    readonly token: Token,
    readonly renew: Token
  ) {}
}
