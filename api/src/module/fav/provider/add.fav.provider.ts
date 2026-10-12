import { Injectable, NotFoundException } from '@nestjs/common'

import { Types } from 'mongoose'

import { PostRepository } from '@/module/post/repository/post.repository'

import { FavResponse } from '../fav.response'
import { FavRepository } from '../repository/fav.repository'

@Injectable()
export class AddFavProvider {
  constructor(
    private readonly _post: PostRepository,
    private readonly repository: FavRepository
  ) {}

  async run(post: string, user: string): Promise<FavResponse> {
    const exists = await this._post.exists({ _id: post, publish: true })

    if (exists) {
      const result = await this.repository.save(new Types.ObjectId(post), new Types.ObjectId(user), {
        returnDocument: 'after'
      })

      if (result) {
        return new FavResponse(post)
      }
    }

    throw new NotFoundException()
  }
}
