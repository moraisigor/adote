import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { PetRepository } from '@/module/pet/repository/pet.repository'
import { State } from '@/module/pet/type/state'
import { PostResponse, type PostView } from '@/module/post/post.response'
import { UserRepository } from '@/module/user/repository/user.repository'

import { ListFavRequest } from '../fav.request'

@Injectable()
export class ListFavProvider {
  constructor(
    private readonly _pet: PetRepository,
    private readonly repository: UserRepository
  ) {}

  async run(request: ListFavRequest, current: string): Promise<PostResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const user = await this.repository.find(
      { _id: new Types.ObjectId(current) },
      { fav: 1 },
      { populate: [] }
    )

    const list = await this._pet.list(
      skip,
      amount,
      { _id: { $in: user?.fav ?? [] }, state: State.PUBLIC },
      {},
      { sort: { create: 1, _id: 1 } }
    )

    return list.map((e) => new PostResponse(e as PostView))
  }
}
