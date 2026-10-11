import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import type { FastifyReply } from 'fastify'
import { Types } from 'mongoose'

import { UserRepository } from '@/module/user/repository/user.repository'

import { unique } from '@/helper/id'

import { Option, RenewOption } from '../type/cookie'

@Injectable()
export class ExpireAuthProvider {
  private readonly TokenRenewSecret: string

  constructor(
    private readonly token: JwtService,
    private readonly config: ConfigService,
    private readonly repository: UserRepository
  ) {
    this.TokenRenewSecret = this.config.getOrThrow<string>('TOKEN_RENEW_SECRET')
  }

  async run(renew?: string, reply: FastifyReply): Promise<void> {
    reply.clearCookie('token', Option)
    reply.clearCookie('renew', RenewOption)

    if (renew) {
      const token = await this.token
        .verifyAsync(renew, { secret: this.TokenRenewSecret })
        .catch((e) => console.error(e))

      if (token) {
        const { sub } = token

        await this.repository.save(new Types.ObjectId(sub), {
          session: unique(40)
        })
      }
    }
  }
}
