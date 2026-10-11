import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'

import type { FastifyReply, FastifyRequest } from 'fastify'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'
import { Public } from '@/decorator/public.decorator'

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
  renew(@Current() current: Session, @Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    const {
      user: { phone },
      session
    } = current

    return this.provider.renew.run(phone, session, reply)
  }

  @Post('expire')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  expire(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    const { cookies } = request

    return this.provider.expire.run(cookies['renew'], reply)
  }
}
