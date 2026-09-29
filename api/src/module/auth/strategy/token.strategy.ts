import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import type { Token, User } from '@/type/token'

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'Token') {
  constructor(readonly config: ConfigService) {
    super({
      secretOrKey: config.getOrThrow<string>('TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  validate(token: Token): User {
    const { user } = token

    return user
  }
}
