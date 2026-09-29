import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'

import { Public } from '@/decorator/public.decorator'

import { ConfigurationProvider } from './provider'

import { BasicGuard } from '../auth/guard/basic.guard'
import type { BreedResponse } from '../breed/breed.response'
import type { LocationResponse } from '../location/location.response'
import type { UserResponse } from '../user/user.response'

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly provider: ConfigurationProvider) {}

  @Post('/user')
  @Public()
  @UseGuards(BasicGuard)
  user(): Promise<UserResponse> {
    return this.provider.user.run()
  }

  @Post('/breed')
  @Public()
  @UseGuards(BasicGuard)
  breed(): Promise<BreedResponse[]> {
    return this.provider.breed.run()
  }

  @Post('/location')
  @Public()
  @UseGuards(BasicGuard)
  location(): Promise<LocationResponse[]> {
    return this.provider.location.run()
  }
}
