import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import type { FastifyRequest } from 'fastify'
import { Strategy } from 'passport-jwt'

import type { Session, Token } from '@/type/token'

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'Token') {
  constructor(readonly config: ConfigService) {
    super({
      secretOrKey: config.getOrThrow<string>('TOKEN_SECRET'),
      jwtFromRequest: (request: FastifyRequest) => request.cookies['token'] ?? null
    })
  }

  validate(token: Token): Session {
    const { user, session } = token

    return { user, session }
  }
}
