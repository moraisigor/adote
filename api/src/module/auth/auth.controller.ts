import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'

import type { FastifyReply } from 'fastify'

import type { User } from '@/type/token'

import { Public } from '@/decorator/public.decorator'
import { UserCurrent } from '@/decorator/user.current.decorator'

import { AuthRequest, VerifyRequest } from './auth.request'
import { AuthResponse } from './auth.response'
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

  @Post('verify')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  code(@Body() request: VerifyRequest, @Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    const { phone, code } = request

    return this.provider.verify.run(phone, code, reply)
  }

  @Post('renew')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TokenRenewGuard)
  renew(@UserCurrent() user: User, @Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    const { phone } = user

    return this.provider.renew.run(phone, reply)
  }

  @Post('expire')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  expire(@Res({ passthrough: true }) reply: FastifyReply) {
    return this.provider.expire.run(reply)
  }
}
