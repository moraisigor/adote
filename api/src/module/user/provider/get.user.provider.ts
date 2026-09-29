import { Injectable, NotFoundException } from '@nestjs/common'

import { UserRepository } from '../repository/user.repository'
import { UserCurrentResponse, UserResponse } from '../user.response'

@Injectable()
export class GetUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string): Promise<UserResponse> {
    const user = await this.repository.find({ _id: id })

    if (user) {
      return new UserCurrentResponse(user)
    }

    throw new NotFoundException()
  }
}
