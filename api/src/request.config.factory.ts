import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler'

@Injectable()
export class RequestConfigFactory implements ThrottlerOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return [
      {
        ttl: this.config.getOrThrow<number>('REQUEST_TIME', 3600),
        limit: this.config.getOrThrow<number>('REQUEST_LIMIT', 4000)
      }
    ]
  }
}
