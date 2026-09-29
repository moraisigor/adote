import { Injectable } from '@nestjs/common'

import { UserRepository } from '../repository/user.repository'
import { UserResponse } from '../user.response'

@Injectable()
export class ListUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(): Promise<UserResponse[]> {
    const list = await this.repository.list()

    return list.map((e) => new UserResponse(e))
  }
}
