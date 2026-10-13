import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { seconds, type ThrottlerModuleOptions, type ThrottlerOptionsFactory } from '@nestjs/throttler'

@Injectable()
export class RequestConfigFactory implements ThrottlerOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    const time = Number(this.config.get<number>('REQUEST_TIME', 60))
    const limit = Number(this.config.get<number>('REQUEST_LIMIT', 100))

    return [
      {
        ttl: seconds(time),
        limit: limit
      }
    ]
  }
}
