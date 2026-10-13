import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { FastifyReply } from 'fastify'
import { isNil } from 'lodash'

import { UserRepository } from '@/module/user/repository/user.repository'

import { TokenAuthProvider } from './token.auth.provider'

@Injectable()
export class RenewAuthProvider {
  constructor(
    private readonly token: TokenAuthProvider,
    private readonly repository: UserRepository
  ) {}

  async run(phone: string, session: string, reply: FastifyReply): Promise<void> {
    const user = await this.repository.find({ phone, session, enable: true })

    if (isNil(user)) {
      throw new UnauthorizedException()
    }

    this.token.run(user, reply)
  }
}
