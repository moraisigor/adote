import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PostRepository } from '@/module/post/repository/post.repository'
import { UserRepository } from '@/module/user/repository/user.repository'

import { FavResponse } from '../fav.response'

const LIMIT = 100

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

    const fav = new Types.ObjectId(post)

    const result = await this.repository.save(
      { _id: new Types.ObjectId(user), $or: [{ [`fav.${LIMIT - 1}`]: { $exists: false } }, { fav }] },
      { $addToSet: { fav } },
      { returnDocument: 'after' }
    )

    // the user is loaded on every request, so no match means the list is full
    if (isNil(result)) {
      throw new BadRequestException()
    }

    return new FavResponse(post)
  }
}
