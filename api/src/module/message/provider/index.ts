import { Injectable } from '@nestjs/common'

import { SendMessageProvider } from './send.message.provider'

@Injectable()
export class MessageProvider {
  constructor(readonly send: SendMessageProvider) {}
}
