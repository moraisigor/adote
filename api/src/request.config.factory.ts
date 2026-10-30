import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { seconds, type ThrottlerOptions, type ThrottlerOptionsFactory } from '@nestjs/throttler'

@Injectable()
export class RequestConfigFactory implements ThrottlerOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createThrottlerOptions(): ThrottlerOptions[] {
    const time = this.config.get<number>('REQUEST_TIME', 60)
    const limit = this.config.get<number>('REQUEST_LIMIT', 100)

    return [
      {
        ttl: seconds(time),
        limit: limit
      }
    ]
  }
}
