import { Injectable } from '@nestjs/common'

import { UserRepository } from '../repository/user.repository'
import { ListUserRequest } from '../user.request'
import { UserResponse } from '../user.response'

@Injectable()
export class ListUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(request: ListUserRequest): Promise<UserResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount)

    return list.map((e) => new UserResponse(e))
  }
}
