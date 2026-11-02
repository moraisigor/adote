import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { UserRepository } from '@/module/user/repository/user.repository'

import { FavResponse } from '../fav.response'

@Injectable()
export class RemoveFavProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(post: string, user: string): Promise<FavResponse> {
    const fav = new Types.ObjectId(post)

    const result = await this.repository.save(
      { _id: new Types.ObjectId(user), fav },
      { $pull: { fav } },
      { returnDocument: 'after' }
    )

    if (isNil(result)) {
      throw new NotFoundException()
    }

    return new FavResponse(post)
  }
}
