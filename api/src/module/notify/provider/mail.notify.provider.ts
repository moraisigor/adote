import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Resend } from 'resend'

@Injectable()
export class MailNotifyProvider {
  private readonly logger = new Logger(MailNotifyProvider.name)

  private readonly from: string
  private readonly sender: Resend

  constructor(private readonly config: ConfigService) {
    this.from = this.config.getOrThrow<string>('MAIL_FROM')
    this.sender = new Resend(this.config.getOrThrow<string>('MAIL_KEY'))
  }

  async run(mail: string, text: string, subject: string) {
    const { error } = await this.sender.emails.send({
      to: mail,
      from: this.from,
      text,
      subject
    })

    if (error) {
      this.logger.error(error)
    }
  }
}
