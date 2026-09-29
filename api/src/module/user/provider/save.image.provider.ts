import { BadRequestException, Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { UserRepository } from '../repository/user.repository'
import { UserResponse } from '../user.response'

@Injectable()
export class SaveImageProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, image: string): Promise<UserResponse> {
    const user = await this.repository.save(new Types.ObjectId(id), { image }, { returnDocument: 'after' })

    if (user) {
      return new UserResponse(user)
    }

    throw new BadRequestException()
  }
}
