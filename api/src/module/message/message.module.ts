import { Module } from '@nestjs/common'

import { MessageProvider } from './provider'
import { SendMessageProvider } from './provider/send.message.provider'

@Module({
  exports: [MessageProvider],
  providers: [MessageProvider, SendMessageProvider]
})
export class MessageModule {}
