import { Injectable } from '@nestjs/common'

import { KeyMemoryProvider } from './key.memory.provider'
import { LockMemoryProvider } from './lock.memory.provider'

@Injectable()
export class MemoryProvider {
  constructor(
    readonly key: KeyMemoryProvider,
    readonly lock: LockMemoryProvider
  ) {}
}
