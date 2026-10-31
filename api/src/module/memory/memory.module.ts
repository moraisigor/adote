import { Global, Module } from '@nestjs/common'

import { MemoryStore } from './memory.store'
import { MemoryThrottlerStorage } from './memory.throttler.storage'
import { MemoryProvider } from './provider'
import { KeyMemoryProvider } from './provider/key.memory.provider'
import { LockMemoryProvider } from './provider/lock.memory.provider'

@Global()
@Module({
  exports: [MemoryProvider, MemoryThrottlerStorage],
  providers: [KeyMemoryProvider, LockMemoryProvider, MemoryProvider, MemoryStore, MemoryThrottlerStorage]
})
export class MemoryModule {}
