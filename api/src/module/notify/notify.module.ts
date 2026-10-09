import { Module } from '@nestjs/common'

import { NotifyProvider } from './provider'
import { MailNotifyProvider } from './provider/mail.notify.provider'
import { SendNotifyProvider } from './provider/send.notify.provider'

@Module({
  exports: [NotifyProvider],
  providers: [NotifyProvider, MailNotifyProvider, SendNotifyProvider]
})
export class NotifyModule {}
