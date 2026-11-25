import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash-es'
import { Types } from 'mongoose'

import { PetRepository } from '@/module/pet/repository/pet.repository'
import { State } from '@/module/pet/type/state'
import { UserRepository } from '@/module/user/repository/user.repository'

import { FavResponse } from '../fav.response'

const LIMIT = 100

@Injectable()
export class AddFavProvider {
  constructor(
    private readonly _pet: PetRepository,
    private readonly repository: UserRepository
  ) {}

  async run(post: string, current: string): Promise<FavResponse> {
    const exists = await this._pet.exists({ _id: post, state: State.PUBLIC })

    if (!exists) {
      throw new NotFoundException()
    }

    const fav = new Types.ObjectId(post)

    const result = await this.repository.save(
      { _id: new Types.ObjectId(current), $or: [{ [`fav.${LIMIT - 1}`]: { $exists: false } }, { fav }] },
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
