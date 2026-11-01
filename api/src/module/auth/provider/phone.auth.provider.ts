import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerException } from '@nestjs/throttler'

import { MemoryProvider } from '@/module/memory/provider'
import { NotifyProvider } from '@/module/notify/provider'

import { generate, sign } from '@/helper/code'

import { LockAuthProvider } from './lock.auth.provider'

import { EXPIRE } from '../constant'

@Injectable()
export class PhoneAuthProvider {
  private readonly secret: string

  constructor(
    private readonly config: ConfigService,
    private readonly lock: LockAuthProvider,
    private readonly notify: NotifyProvider,
    private readonly memory: MemoryProvider
  ) {
    this.secret = this.config.getOrThrow<string>('CODE_SECRET')
  }

  async run(phone: string): Promise<void> {
    const lock = await this.lock.is(phone)

    if (lock) {
      throw new ThrottlerException()
    }

    const code = generate()

    await this.memory.key.set(`auth:code:${phone}`, EXPIRE, sign(code, phone, this.secret))

    await this.memory.key.remove(`auth:attempt:${phone}`)

    await this.notify.code.run(phone, code)
  }
}
