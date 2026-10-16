import { Module } from '@nestjs/common'

import { NotifyProvider } from './provider'
import { CodeNotifyProvider } from './provider/code.notify.provider'
import { MailNotifyProvider } from './provider/mail.notify.provider'

@Module({
  exports: [NotifyProvider],
  providers: [CodeNotifyProvider, MailNotifyProvider, NotifyProvider]
})
export class NotifyModule {}
