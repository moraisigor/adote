import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { Cache } from 'cache-manager'
import { isNil } from 'lodash'

import { NotifyProvider } from '@/module/notify/provider'
import { UserRepository } from '@/module/user/repository/user.repository'
import type { UserDocument } from '@/module/user/repository/user.schema'

import { generate, sign } from '@/helper/code'

import { AuthResponse } from '../auth.response'
import type { Code } from '../type/code'

const EXPIRE = 5 * 60 * 1000

const ATTEMPT = 0

@Injectable()
export class PhoneAuthProvider {
  private readonly CodeSecret: string

  constructor(
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly config: ConfigService,
    private readonly notify: NotifyProvider,
    private readonly repository: UserRepository
  ) {
    this.CodeSecret = this.config.getOrThrow<string>('CODE_SECRET')
  }

  async run(phone: string): Promise<AuthResponse> {
    const user = await this.save(phone)

    const code = generate()

    await this.store.set<Code>(
      phone,
      {
        hash: sign(code, phone, this.CodeSecret),
        expire: Date.now() + EXPIRE,
        attempt: ATTEMPT
      },
      EXPIRE
    )

    await this.notify.code.run(phone, code)

    return new AuthResponse(user)
  }

  private async save(phone: string): Promise<UserDocument> {
    const user = await this.repository.find({ phone })

    if (isNil(user)) {
      return await this.repository.create({ phone })
    }

    return user
  }
}
