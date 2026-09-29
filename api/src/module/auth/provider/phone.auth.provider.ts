import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

import * as bcrypt from 'bcrypt'
import type { Cache } from 'cache-manager'
import { isNil } from 'lodash'

import { MessageProvider } from '@/module/message/provider'
import { UserRepository } from '@/module/user/repository/user.repository'
import type { UserDocument } from '@/module/user/repository/user.schema'

import { unique } from '@/helper/id'

import { AuthResponse } from '../auth.response'

@Injectable()
export class PhoneAuthProvider {
  constructor(
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly message: MessageProvider,
    private readonly repository: UserRepository
  ) {}

  async run(phone: string): Promise<AuthResponse> {
    const user = await this.save(phone)

    const hash = await bcrypt.hash('999999', 11)

    await this.store.set(phone, hash)

    this.message.send.run(phone, '')

    return new AuthResponse(user)
  }

  private async save(phone: string): Promise<UserDocument> {
    const user = await this.repository.find({ phone })

    if (isNil(user)) {
      const create = {
        key: unique(40),
        phone
      }

      return await this.repository.create(create)
    }

    return user
  }
}
