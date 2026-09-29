import { Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'

import type { User } from '@/type/token'

import { UserCurrent } from '@/decorator/user.current.decorator'

import { AddFavParam, RemoveFavParam } from './fav.request'
import type { FavResponse } from './fav.response'
import { FavProvider } from './provider'

@Controller()
export class FavController {
  constructor(private readonly provider: FavProvider) {}

  @Post(':post')
  @HttpCode(HttpStatus.OK)
  add(@Param() param: AddFavParam, @UserCurrent() user: User): Promise<FavResponse> {
    const { post } = param
    const { id: current } = user

    return this.provider.add.run(post, current)
  }

  @Delete(':post')
  remove(@Param() param: RemoveFavParam, @UserCurrent() user: User): Promise<FavResponse> {
    const { post } = param
    const { id: current } = user

    return this.provider.remove.run(post, current)
  }
}
