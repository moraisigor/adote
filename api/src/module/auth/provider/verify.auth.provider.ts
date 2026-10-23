import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerException } from '@nestjs/throttler'

import type { Cache } from 'cache-manager'
import type { FastifyReply } from 'fastify'
import { isNil } from 'lodash'

import { UserRepository } from '@/module/user/repository/user.repository'

import { equals } from '@/helper/code'
import { serialize } from '@/helper/queue'

import { LockAuthProvider } from './lock.auth.provider'
import { TokenAuthProvider } from './token.auth.provider'

import type { Code } from '../type/code'

const ATTEMPT = 5

const INTERVAL = 0

@Injectable()
export class VerifyAuthProvider {
  private readonly secret: string

  constructor(
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly config: ConfigService,
    private readonly lock: LockAuthProvider,
    private readonly token: TokenAuthProvider,
    private readonly repository: UserRepository
  ) {
    this.secret = this.config.getOrThrow<string>('CODE_SECRET')
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

  private async check(phone: string, code: string): Promise<boolean> {
    const lock = await this.lock.is(phone)

    if (lock) {
      throw new ThrottlerException()
    }

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

    const verify = {
      code,
      phone,
      secret: this.secret
    }

    if (equals(hash, verify)) {
      // remove from lock
      await this.lock.reset(phone)

      // remove from store
      await this.store.del(phone)

      return true
    }

    await this.store.set<Code>(
      phone,
      {
        hash,
        expire,
        attempt: attempt + 1
      },
      interval
    )

    await this.lock.fail(phone)

    return false
  }

  async run(phone: string, code: string, reply: FastifyReply): Promise<void> {
    const valid = await serialize(`verify:${phone}`, () => this.check(phone, code))

    if (!valid) {
      throw new UnauthorizedException()
    }

    const user = await this.save(phone)

    if (isNil(user)) {
      throw new UnauthorizedException()
    }

    const { enable } = user

    if (!enable) {
      throw new UnauthorizedException()
    }

    return this.token.run(user, reply)
  }
}
