import { Global, Module } from '@nestjs/common'

import { MemoryStore } from './memory.store'
import { MemoryThrottlerStorage } from './memory.throttler.storage'
import { MemoryProvider } from './provider'
import { KeyMemoryProvider } from './provider/key.memory.provider'
import { LockMemoryProvider } from './provider/lock.memory.provider'
import { MemoryConfigFactory } from '@/memory.config.factory'

@Global()
@Module({
  exports: [MemoryProvider, MemoryThrottlerStorage],
  providers: [
    KeyMemoryProvider,
    LockMemoryProvider,
    MemoryConfigFactory,
    MemoryProvider,
    MemoryStore,
    MemoryThrottlerStorage
  ]
})
export class MemoryModule {}
