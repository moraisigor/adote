import { Injectable, NotFoundException } from '@nestjs/common'

import { UserRepository } from '../repository/user.repository'
import { UserCurrentResponse } from '../user.response'

@Injectable()
export class GetCurrentProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string): Promise<UserCurrentResponse> {
    const user = await this.repository.find({ _id: id })

    if (user) {
      return new UserCurrentResponse(user)
    }

    throw new NotFoundException()
  }
}
