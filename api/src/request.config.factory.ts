import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  seconds,
  type ThrottlerModuleOptions,
  type ThrottlerOptions,
  type ThrottlerOptionsFactory
} from '@nestjs/throttler'

import { MemoryThrottlerStorage } from '@/module/memory/memory.throttler.storage'

@Injectable()
export class RequestConfigFactory implements ThrottlerOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly storage: MemoryThrottlerStorage
  ) {}

  createThrottlerOptions(): Exclude<ThrottlerModuleOptions, ThrottlerOptions[]> {
    const time = this.config.get<number>('REQUEST_TIME', 60)
    const limit = this.config.get<number>('REQUEST_LIMIT', 100)

    return {
      storage: this.storage,
      throttlers: [
        {
          ttl: seconds(time),
          limit: limit
        }
      ]
    }
  }
}
