import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'
import type { Cache } from 'cache-manager'
import type { FastifyReply } from 'fastify'
import { isNil } from 'lodash'

import { UserRepository } from '@/module/user/repository/user.repository'

import { Option, RenewOption } from '../type/cookie'

@Injectable()
export class VerifyAuthProvider {
  private readonly TokenSecret: string
  private readonly TokenExpire: number
  private readonly TokenRenewSecret: string
  private readonly TokenRenewExpire: number

  constructor(
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly token: JwtService,
    private readonly config: ConfigService,
    private readonly repository: UserRepository
  ) {
    this.TokenSecret = this.config.getOrThrow<string>('TOKEN_SECRET')
    this.TokenExpire = Number(this.config.getOrThrow<string>('TOKEN_EXPIRE'))
    this.TokenRenewSecret = this.config.getOrThrow<string>('TOKEN_RENEW_SECRET')
    this.TokenRenewExpire = Number(this.config.getOrThrow<string>('TOKEN_RENEW_EXPIRE'))
  }

  async run(phone: string, code: string, reply: FastifyReply): Promise<void> {
    const hash = await this.store.get<string>(phone)

    const value = await bcrypt.compare(code, hash ?? '')

    if (value === false) {
      throw new UnauthorizedException()
    }

    const user = await this.repository.find({ phone })

    if (isNil(user)) {
      throw new UnauthorizedException()
    }

    const param = {
      sub: user.id,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role
      }
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
