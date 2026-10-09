import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import type { FastifyRequest } from 'fastify'
import { Strategy } from 'passport-jwt'

import type { Token, User } from '@/type/token'

@Injectable()
export class TokenRenewStrategy extends PassportStrategy(Strategy, 'TokenRenew') {
  constructor(readonly config: ConfigService) {
    super({
      secretOrKey: config.getOrThrow<string>('TOKEN_RENEW_SECRET'),
      jwtFromRequest: (request: FastifyRequest) => request.cookies['renew'] ?? null
    })
  }

  validate(token: Token): User {
    const { user } = token

    return user
  }
}
