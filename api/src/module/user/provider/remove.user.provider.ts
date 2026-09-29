import { BadRequestException, Injectable } from '@nestjs/common'

import { UserRepository } from '../repository/user.repository'
import { RemoveUserResponse } from '../user.response'

@Injectable()
export class RemoveUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string): Promise<RemoveUserResponse> {
    const result = await this.repository.remove({ _id: id })

    if (result) {
      return new RemoveUserResponse(id)
    }

    throw new BadRequestException()
  }
}
