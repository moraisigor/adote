import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { isNil } from 'lodash'

import { UserRepository } from '@/module/user/repository/user.repository'

import { TokenResponse } from '../auth.response'

@Injectable()
export class RenewAuthProvider {
  private readonly TokenSecret: string
  private readonly TokenExpire: number
  private readonly TokenRenewSecret: string
  private readonly TokenRenewExpire: number

  constructor(
    private readonly token: JwtService,
    private readonly config: ConfigService,
    private readonly repository: UserRepository
  ) {
    this.TokenSecret = this.config.getOrThrow<string>('TOKEN_SECRET')
    this.TokenExpire = this.config.getOrThrow<number>('TOKEN_EXPIRE')
    this.TokenRenewSecret = this.config.getOrThrow<string>('TOKEN_RENEW_SECRET')
    this.TokenRenewExpire = this.config.getOrThrow<number>('TOKEN_RENEW_EXPIRE')
  }

  async run(phone: string): Promise<TokenResponse> {
    const user = await this.repository.find({ phone })

    if (isNil(user)) {
      throw new BadRequestException()
    }

    const param = {
      sub: user.id,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role
      }
    }

    const token = {
      hash: this.token.sign(param, {
        secret: this.TokenSecret,
        expiresIn: this.TokenExpire
      }),
      expire: +this.TokenExpire
    }

    const renew = {
      hash: this.token.sign(param, {
        secret: this.TokenRenewSecret,
        expiresIn: this.TokenRenewExpire
      }),
      expire: +this.TokenRenewExpire
    }

    return new TokenResponse(token, renew)
  }
}
