import { Injectable } from '@nestjs/common'

import { CodeNotifyProvider } from './code.notify.provider'
import { MailNotifyProvider } from './mail.notify.provider'

@Injectable()
export class NotifyProvider {
  constructor(
    readonly code: CodeNotifyProvider,
    readonly mail: MailNotifyProvider
  ) {}
}
