import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common'
import { hours, Throttle } from '@nestjs/throttler'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'
import { Public } from '@/decorator/public.decorator'

import { CreateAdopterRequest, ListAdopterRequest } from './adopter.request'
import type { AdopterResponse } from './adopter.response'
import { AdopterProvider } from './provider'

@Controller('adopter')
export class AdopterController {
  constructor(private readonly provider: AdopterProvider) {}

  @Get()
  list(@Query() request: ListAdopterRequest, @Current() session: Session): Promise<AdopterResponse[]> {
    const {
      user: { id }
    } = session

    return this.provider.list.run(request, id)
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { ttl: hours(1), limit: 5 } })
  create(@Body() request: CreateAdopterRequest): Promise<void> {
    return this.provider.create.run(request)
  }
}
