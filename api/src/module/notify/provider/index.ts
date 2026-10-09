import { Injectable } from '@nestjs/common'

import { MailNotifyProvider } from './mail.notify.provider'
import { SendNotifyProvider } from './send.notify.provider'

@Injectable()
export class NotifyProvider {
  constructor(
    readonly mail: MailNotifyProvider,
    readonly send: SendNotifyProvider
  ) {}
}
