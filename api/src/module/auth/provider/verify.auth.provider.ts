import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { Cache } from 'cache-manager'
import type { FastifyReply } from 'fastify'
import { isNil } from 'lodash'

import { UserRepository } from '@/module/user/repository/user.repository'

import { sign } from '@/helper/code'

import { TokenAuthProvider } from './token.auth.provider'

import type { Code } from '../type/code'

const ATTEMPT = 5

const INTERVAL = 0

@Injectable()
export class VerifyAuthProvider {
  private readonly CodeSecret: string

  constructor(
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly config: ConfigService,
    private readonly token: TokenAuthProvider,
    private readonly repository: UserRepository
  ) {
    this.CodeSecret = this.config.getOrThrow<string>('CODE_SECRET')
  }

  private save(phone: string) {
    return this.repository.update(
      { phone },
      { $setOnInsert: { phone } },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
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

    const user = await this.save(phone)

    if (user) {
      const { enable } = user

      if (enable) {
        return this.token.run(user, reply)
      }
    }

    throw new UnauthorizedException()
  }
}
