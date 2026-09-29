import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'

import type { User } from '@/type/token'

import { Public } from '@/decorator/public.decorator'
import { UserCurrent } from '@/decorator/user.current.decorator'

import { AuthRequest, VerifyRequest } from './auth.request'
import { AuthResponse, TokenResponse } from './auth.response'
import { KeyGuard } from './guard/key.guard'
import { TokenRenewGuard } from './guard/token.renew.guard'
import { AuthProvider } from './provider'

@Controller('auth')
export class AuthController {
  constructor(private readonly provider: AuthProvider) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  phone(@Body() request: AuthRequest): Promise<AuthResponse> {
    const { phone } = request

    return this.provider.phone.run(phone)
  }

  @Post('key')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(KeyGuard)
  key(@Headers() header: Record<string, string>): Promise<TokenResponse> {
    return this.provider.key.run(header['key'])
  }

  @Post('verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  code(@Body() request: VerifyRequest): Promise<TokenResponse> {
    const { phone, code } = request

    return this.provider.verify.run(phone, code)
  }

  @Post('renew')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenRenewGuard)
  renew(@UserCurrent() user: User): Promise<TokenResponse> {
    const { phone } = user

    return this.provider.renew.run(phone)
  }
}
