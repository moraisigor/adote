import { Body, Controller, Post } from '@nestjs/common'
import { hours, Throttle } from '@nestjs/throttler'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'

import { SaveImageRequest } from './image.request'
import type { ImageResponse } from './image.response'
import { ImageProvider } from './provider'

@Controller('image')
export class ImageController {
  constructor(private readonly provider: ImageProvider) {}

  @Post()
  @Throttle({ default: { limit: 50, ttl: hours(1) } })
  save(@Body() request: SaveImageRequest, @Current() session: Session): Promise<ImageResponse> {
    const {
      user: { id }
    } = session

    return this.provider.save.run(request, id)
  }
}
