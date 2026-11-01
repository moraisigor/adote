import { Injectable, type OnModuleDestroy } from '@nestjs/common'

import { RedisClient } from 'bun'

import { MemoryConfigFactory } from '@/memory.config.factory'

@Injectable()
export class MemoryStore implements OnModuleDestroy {
  readonly client: RedisClient

  constructor(private readonly config: MemoryConfigFactory) {
    const { uri } = config.createMemoryOptions()

    this.client = new RedisClient(uri)
  }

  onModuleDestroy() {
    this.client.close()
  }
}
