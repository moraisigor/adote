import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { assign, object } from '@/helper/repository'

import { UserRepository } from '../repository/user.repository'
import { SaveUserRequest } from '../user.request'
import { CurrentUserResponse } from '../user.response'

@Injectable()
export class SaveUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, request: SaveUserRequest): Promise<CurrentUserResponse> {
    const { name, contact, location } = request

    const map = assign({
      name,
      contact,
      location: object(location)
    })

    const user = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (isNil(user)) {
      throw new NotFoundException()
    }

    return new CurrentUserResponse(user)
  }
}
