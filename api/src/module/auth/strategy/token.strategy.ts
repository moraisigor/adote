import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import type { FastifyRequest } from 'fastify'
import { isNil } from 'lodash'
import { Strategy } from 'passport-jwt'

import type { Session, Token } from '@/type/token'

import { UserRepository } from '@/module/user/repository/user.repository'

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'Token') {
  constructor(
    readonly config: ConfigService,
    private readonly repository: UserRepository
  ) {
    super({
      secretOrKey: config.getOrThrow<string>('TOKEN_SECRET'),
      jwtFromRequest: (request: FastifyRequest) => request.cookies['token'] ?? null
    })
  }

  async validate(token: Token): Promise<Session> {
    const { sub, session } = token

    const user = await this.repository.find({ _id: sub })

    if (isNil(user)) {
      throw new UnauthorizedException()
    }

    const { id, phone, role, enable } = user

    if (!enable) {
      throw new UnauthorizedException()
    }

    return {
      user: {
        id,
        phone,
        role
      },
      session
    }
  }
}
