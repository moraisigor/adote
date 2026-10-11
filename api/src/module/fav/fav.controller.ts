import { Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'

import { AddFavParam, RemoveFavParam } from './fav.request'
import type { FavResponse } from './fav.response'
import { FavProvider } from './provider'

@Controller()
export class FavController {
  constructor(private readonly provider: FavProvider) {}

  @Post(':post')
  @HttpCode(HttpStatus.OK)
  add(@Param() param: AddFavParam, @Current() session: Session): Promise<FavResponse> {
    const { post } = param
    const {
      user: { id }
    } = session

    return this.provider.add.run(post, id)
  }

  @Delete(':post')
  remove(@Param() param: RemoveFavParam, @Current() session: Session): Promise<FavResponse> {
    const { post } = param
    const {
      user: { id }
    } = session

    return this.provider.remove.run(post, id)
  }
}
