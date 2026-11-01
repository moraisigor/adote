import { Injectable } from '@nestjs/common'

import { MemoryProvider } from '@/module/memory/provider'

const FAIL = 10
const WINDOW = 60 * 60 * 1000

@Injectable()
export class LockAuthProvider {
  constructor(private readonly memory: MemoryProvider) {}

  private key(phone: string): string {
    return `auth:lock:${phone}`
  }

  async is(phone: string): Promise<boolean> {
    const amount = await this.memory.key.get<number>(this.key(phone))

    if (amount) {
      return amount >= FAIL
    }

    return false
  }

  async fail(phone: string): Promise<void> {
    const amount = await this.memory.key.increment(this.key(phone), WINDOW)

    if (amount === FAIL) {
      await this.memory.key.set(this.key(phone), amount, WINDOW)
    }
  }

  async reset(phone: string): Promise<boolean> {
    return await this.memory.key.remove(this.key(phone))
  }
}
