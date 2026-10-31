import { Injectable } from '@nestjs/common'

import { isNil } from 'lodash'

import { MemoryStore } from '../memory.store'

@Injectable()
export class LockMemoryProvider {
  constructor(private readonly memory: MemoryStore) {}

  async run(name: string, time: number): Promise<boolean> {
    const result = await this.memory.client.set(`lock:${name}`, '1', 'PX', String(time), 'NX')

    return !isNil(result)
  }
}
