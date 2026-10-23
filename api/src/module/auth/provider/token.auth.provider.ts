import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import type { FastifyReply } from 'fastify'

import type { UserDocument } from '@/module/user/repository/user.schema'

import { Option, RenewOption } from '../type/cookie'

type Param = {
  token: {
    secret: string
    expire: number
  }
  renew: {
    secret: string
    expire: number
  }
}

@Injectable()
export class TokenAuthProvider {
  private readonly param: Param

  constructor(
    private readonly token: JwtService,
    private readonly config: ConfigService
  ) {
    this.param = {
      token: {
        secret: this.config.getOrThrow<string>('TOKEN_SECRET'),
        expire: this.config.getOrThrow<number>('TOKEN_EXPIRE')
      },
      renew: {
        secret: this.config.getOrThrow<string>('TOKEN_RENEW_SECRET'),
        expire: this.config.getOrThrow<number>('TOKEN_RENEW_EXPIRE')
      }
    }
  }

  run(user: Pick<UserDocument, 'id' | 'phone' | 'role' | 'session'>, reply: FastifyReply) {
    const value = {
      sub: user.id,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role
      },
      session: user.session
    }

    const token = {
      hash: this.token.sign(value, {
        secret: this.param.token.secret,
        expiresIn: this.param.token.expire
      }),
      expire: this.param.token.expire
    }

    const renew = {
      hash: this.token.sign(value, {
        secret: this.param.renew.secret,
        expiresIn: this.param.renew.expire
      }),
      expire: this.param.renew.expire
    }

    reply.setCookie('token', token.hash, {
      ...Option,
      expires: new Date(Date.now() + token.expire * 1000)
    })

    reply.setCookie('renew', renew.hash, {
      ...RenewOption,
      expires: new Date(Date.now() + renew.expire * 1000)
    })
  }
}
