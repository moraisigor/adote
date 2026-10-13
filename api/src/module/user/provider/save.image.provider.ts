import { Injectable, NotFoundException } from '@nestjs/common'

import { Types } from 'mongoose'

import { UserRepository } from '../repository/user.repository'
import { CurrentUserResponse } from '../user.response'

@Injectable()
export class SaveImageProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, image: string): Promise<CurrentUserResponse> {
    const user = await this.repository.save(new Types.ObjectId(id), { image }, { returnDocument: 'after' })

    if (user) {
      return new CurrentUserResponse(user)
    }

    throw new NotFoundException()
  }
}
