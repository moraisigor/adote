import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import type { FastifyReply } from 'fastify'

import type { UserDocument } from '@/module/user/repository/user.schema'

import { Option, RenewOption } from '../type/cookie'

@Injectable()
export class TokenAuthProvider {
  private readonly TokenSecret: string
  private readonly TokenExpire: number
  private readonly TokenRenewSecret: string
  private readonly TokenRenewExpire: number

  constructor(
    private readonly token: JwtService,
    private readonly config: ConfigService
  ) {
    this.TokenSecret = this.config.getOrThrow<string>('TOKEN_SECRET')
    this.TokenExpire = Number(this.config.getOrThrow<string>('TOKEN_EXPIRE'))
    this.TokenRenewSecret = this.config.getOrThrow<string>('TOKEN_RENEW_SECRET')
    this.TokenRenewExpire = Number(this.config.getOrThrow<string>('TOKEN_RENEW_EXPIRE'))
  }

  run(user: Pick<UserDocument, 'id' | 'phone' | 'role' | 'session'>, reply: FastifyReply) {
    const param = {
      sub: user.id,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role
      },
      session: user.session
    }

    const token = {
      hash: this.token.sign(param, {
        secret: this.TokenSecret,
        expiresIn: this.TokenExpire
      }),
      expire: this.TokenExpire
    }

    const renew = {
      hash: this.token.sign(param, {
        secret: this.TokenRenewSecret,
        expiresIn: this.TokenRenewExpire
      }),
      expire: this.TokenRenewExpire
    }

    reply.setCookie(
      'token',
      token.hash,
      Object.assign({}, Option, {
        expires: new Date(Date.now() + token.expire * 1000)
      })
    )

    reply.setCookie(
      'renew',
      renew.hash,
      Object.assign({}, RenewOption, {
        expires: new Date(Date.now() + renew.expire * 1000)
      })
    )
  }
}
