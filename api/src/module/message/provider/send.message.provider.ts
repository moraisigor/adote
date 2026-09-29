import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SendMessageProvider {
  constructor(private readonly config: ConfigService) {}

  run(phone: string, message: string): Promise<void> {
    return Promise.resolve()
  }
}
