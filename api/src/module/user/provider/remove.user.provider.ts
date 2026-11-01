import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { UserRepository } from '../repository/user.repository'
import { UserEvent } from '../user.event'
import { RemoveUserResponse } from '../user.response'

@Injectable()
export class RemoveUserProvider {
  constructor(
    private readonly event: EventEmitter2,
    private readonly repository: UserRepository
  ) {}

  async run(id: string): Promise<RemoveUserResponse> {
    const result = await this.repository.remove({ _id: id })

    if (!result) {
      throw new NotFoundException()
    }

    await this.event.emitAsync(UserEvent.REMOVE, id)

    return new RemoveUserResponse(id)
  }
}
