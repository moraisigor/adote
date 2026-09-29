import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { BasicStrategy as Strategy } from 'passport-http'

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'Basic') {
  constructor(private readonly config: ConfigService) {
    super()
  }

  validate(user: string, pass: string): boolean {
    return (
      user === this.config.getOrThrow<string>('AUTHENTICATION_BASIC_USER') &&
      pass === this.config.getOrThrow<string>('AUTHENTICATION_BASIC_PASS')
    )
  }
}
