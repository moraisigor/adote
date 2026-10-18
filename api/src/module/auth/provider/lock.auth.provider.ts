import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

import type { Cache } from 'cache-manager'

import type { Lock } from '../type/code'

const FAIL = 10

const COUNT = 0

const WINDOW = 60 * 60 * 1000

@Injectable()
export class LockAuthProvider {
  constructor(@Inject(CACHE_MANAGER) private readonly store: Cache) {}

  private key(phone: string): string {
    return `lock:${phone}`
  }

  private async find(phone: string): Promise<Lock> {
    const value = await this.store.get<Lock>(this.key(phone))

    return value ?? { count: COUNT, expire: Date.now() + WINDOW }
  }

  async is(phone: string): Promise<boolean> {
    const value = await this.store.get<Lock>(this.key(phone))

    if (value) {
      return value.count >= FAIL
    }

    return false
  }

  async fail(phone: string): Promise<Lock> {
    const { count, expire } = await this.find(phone)

    const attempt = count + 1
    const expiration = attempt >= FAIL ? Date.now() + WINDOW : expire

    return await this.store.set<Lock>(
      this.key(phone),
      {
        count: attempt,
        expire: expiration
      },
      expiration - Date.now()
    )
  }

  async reset(phone: string): Promise<boolean> {
    return await this.store.del(this.key(phone))
  }
}
