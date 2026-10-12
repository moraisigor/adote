import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import type { Cache } from 'cache-manager'
import type { FastifyReply } from 'fastify'
import { isNil } from 'lodash'

import { UserRepository } from '@/module/user/repository/user.repository'

import { sign } from '@/helper/code'

import type { Code } from '../type/code'
import { Option, RenewOption } from '../type/cookie'

const ATTEMPT = 5

const INTERVAL = 0

@Injectable()
export class VerifyAuthProvider {
  private readonly CodeSecret: string
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
    this.CodeSecret = this.config.getOrThrow<string>('CODE_SECRET')
    this.TokenSecret = this.config.getOrThrow<string>('TOKEN_SECRET')
    this.TokenExpire = Number(this.config.getOrThrow<string>('TOKEN_EXPIRE'))
    this.TokenRenewSecret = this.config.getOrThrow<string>('TOKEN_RENEW_SECRET')
    this.TokenRenewExpire = Number(this.config.getOrThrow<string>('TOKEN_RENEW_EXPIRE'))
  }

  private equals(hash: string, code: string, phone: string) {
    return hash === sign(code, phone, this.CodeSecret)
  }

  async run(phone: string, code: string, reply: FastifyReply): Promise<void> {
    const find = await this.store.get<Code>(phone)

    if (isNil(find)) {
      throw new UnauthorizedException()
    }

    const { hash, expire, attempt } = find

    const interval = expire - Date.now()

    if (attempt >= ATTEMPT) {
      throw new UnauthorizedException()
    }

    if (interval <= INTERVAL) {
      throw new UnauthorizedException()
    }

    if (!this.equals(hash, code, phone)) {
      await this.store.set<Code>(
        phone,
        {
          hash,
          expire,
          attempt: attempt + 1
        },
        interval
      )

      throw new UnauthorizedException()
    }

    await this.store.del(phone)

    const user = await this.repository.find({ phone, enable: true })

    if (isNil(user)) {
      throw new UnauthorizedException()
    }

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
