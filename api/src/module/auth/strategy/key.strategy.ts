import { BadRequestException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { HeaderAPIKeyStrategy as Strategy } from 'passport-headerapikey'

import { UserRepository } from '@/module/user/repository/user.repository'

type Next = (error: Error | null, result: unknown | null) => void

@Injectable()
export class KeyStrategy extends PassportStrategy(Strategy, 'Key') {
  constructor(private readonly repository: UserRepository) {
    super({ header: 'Key', prefix: '' }, false)
  }

  async validate(key: string, next: Next): Promise<unknown> {
    const user = await this.repository.find({ key })

    if (user) {
      return next(null, user)
    }

    return next(new BadRequestException(), null)
  }
}
