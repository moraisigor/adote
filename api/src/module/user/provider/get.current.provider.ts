import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { UserRepository } from '../repository/user.repository'
import { CurrentUserResponse } from '../user.response'

@Injectable()
export class GetCurrentProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string): Promise<CurrentUserResponse> {
    const user = await this.repository.find({ _id: id })

    if (isNil(user)) {
      throw new NotFoundException()
    }

    return new CurrentUserResponse(user)
  }
}
