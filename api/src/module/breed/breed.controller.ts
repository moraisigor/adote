import { Controller, Get, Query } from '@nestjs/common'

import { Public } from '@/decorator/public.decorator'

import { ListBreedRequest } from './breed.request'
import { BreedResponse } from './breed.response'
import { BreedProvider } from './provider'

@Controller('breed')
export class BreedController {
  constructor(private readonly provider: BreedProvider) {}

  @Get()
  @Public()
  list(@Query() request: ListBreedRequest): Promise<BreedResponse[]> {
    const { kind } = request

    return this.provider.list.run(kind)
  }
}
