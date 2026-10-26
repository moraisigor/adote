import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { PostResponse } from '@/module/post/post.response'
import { PostRepository } from '@/module/post/repository/post.repository'

import { ListFavRequest } from '../fav.request'
import { FavRepository } from '../repository/fav.repository'

@Injectable()
export class ListFavProvider {
  constructor(
    private readonly _post: PostRepository,
    private readonly repository: FavRepository
  ) {}

  async run(request: ListFavRequest, current: string): Promise<PostResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const user = await this.repository.find(new Types.ObjectId(current), { fav: 1 })

    const list = await this._post.list(
      skip,
      amount,
      { _id: { $in: user?.fav ?? [] }, publish: true },
      {},
      { sort: { create: 1 } }
    )

    return list.map((e) => new PostResponse(e))
  }
}
