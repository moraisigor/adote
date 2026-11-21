import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { PetEvent } from '@/module/pet/pet.event'
import { UserRepository } from '@/module/user/repository/user.repository'

@Injectable()
export class RemoveFavListener {
  constructor(private readonly repository: UserRepository) {}

  @OnEvent(PetEvent.REMOVE, { suppressErrors: false })
  async pet(list: string[]) {
    await this.repository.update(
      {
        fav: { $in: list }
      },
      {
        $pull: { fav: { $in: list } }
      }
    )
  }
}
