import { Injectable, type OnModuleDestroy } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'

import { RedisClient } from 'bun'

@Injectable()
export class MemoryStore implements OnModuleDestroy {
  readonly client: RedisClient

  constructor(private readonly config: ConfigService) {
    this.client = new RedisClient(this.config.getOrThrow<string>('MEMORY_URI'))
  }

  onModuleDestroy() {
    this.client.close()
  }
}
