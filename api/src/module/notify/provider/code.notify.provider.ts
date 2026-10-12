import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { isDevelopment } from '@/helper/env'

@Injectable()
export class CodeNotifyProvider {
  private readonly logger = new Logger(CodeNotifyProvider.name)

  constructor(private readonly config: ConfigService) {}

  run(phone: string, code: string): Promise<void> {
    if (isDevelopment) {
      this.logger.log(`${phone} - ${code}`)
    }

    return Promise.resolve()
  }
}
