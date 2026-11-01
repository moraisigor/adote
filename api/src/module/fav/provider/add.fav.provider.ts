import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PostRepository } from '@/module/post/repository/post.repository'
import { UserRepository } from '@/module/user/repository/user.repository'

import { FavResponse } from '../fav.response'

@Injectable()
export class AddFavProvider {
  constructor(
    private readonly post: PostRepository,
    private readonly repository: UserRepository
  ) {}

  async run(post: string, user: string): Promise<FavResponse> {
    const exists = await this.post.exists({ _id: post, publish: true })

    if (!exists) {
      throw new NotFoundException()
    }

    const result = await this.repository.update(
      { _id: new Types.ObjectId(user) },
      { $addToSet: { fav: new Types.ObjectId(post) } },
      { returnDocument: 'after' }
    )

    if (isNil(result)) {
      throw new NotFoundException()
    }

    return new FavResponse(post)
  }
}
