import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerException } from '@nestjs/throttler'

import type { FastifyReply } from 'fastify'
import { isNil } from 'lodash-es'

import { MemoryProvider } from '@/module/memory/provider'
import { UserRepository } from '@/module/user/repository/user.repository'

import { equals } from '@/helper/code'

import { LockAuthProvider } from './lock.auth.provider'
import { TokenAuthProvider } from './token.auth.provider'

import { EXPIRE } from '../constant'

const ATTEMPT = 5

@Injectable()
export class VerifyAuthProvider {
  private readonly secret: string

  constructor(
    private readonly config: ConfigService,
    private readonly lock: LockAuthProvider,
    private readonly token: TokenAuthProvider,
    private readonly memory: MemoryProvider,
    private readonly repository: UserRepository
  ) {
    this.secret = this.config.getOrThrow<string>('CODE_SECRET')
  }

  private save(phone: string) {
    return this.repository.save(
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

    const hash = await this.memory.key.get<string>(`auth:code:${phone}`)

    if (isNil(hash)) {
      throw new UnauthorizedException()
    }

    const attempt = await this.memory.key.increment(`auth:attempt:${phone}`, EXPIRE)

    if (attempt > ATTEMPT) {
      throw new UnauthorizedException()
    }

    const verify = {
      code,
      phone,
      secret: this.secret
    }

    if (equals(hash, verify)) {
      await this.lock.reset(phone)

      return await this.memory.key.remove(`auth:code:${phone}`)
    }

    await this.lock.fail(phone)

    return false
  }

  async run(phone: string, code: string, reply: FastifyReply): Promise<void> {
    const valid = await this.check(phone, code)

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
