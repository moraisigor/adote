import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { Cache } from 'cache-manager'

import { NotifyProvider } from '@/module/notify/provider'

import { generate, sign } from '@/helper/code'

import type { Code } from '../type/code'

const EXPIRE = 5 * 60 * 1000

const ATTEMPT = 0

@Injectable()
export class PhoneAuthProvider {
  private readonly CodeSecret: string

  constructor(
    @Inject(CACHE_MANAGER) private readonly store: Cache,
    private readonly config: ConfigService,
    private readonly notify: NotifyProvider
  ) {
    this.CodeSecret = this.config.getOrThrow<string>('CODE_SECRET')
  }

  async run(phone: string): Promise<void> {
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
  }
}
