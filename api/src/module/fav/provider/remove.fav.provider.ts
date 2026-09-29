import { BadRequestException, Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { FavResponse } from '../fav.response'
import { FavRepository } from '../repository/fav.repository'

@Injectable()
export class RemoveFavProvider {
  constructor(private readonly repository: FavRepository) {}

  async run(post: string, user: string): Promise<FavResponse> {
    const result = await this.repository.remove(new Types.ObjectId(post), new Types.ObjectId(user), {
      returnDocument: 'after'
    })

    if (result) {
      return new FavResponse(post)
    }

    throw new BadRequestException()
  }
}
