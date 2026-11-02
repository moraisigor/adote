import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { PostEvent } from '@/module/post/post.event'
import { UserRepository } from '@/module/user/repository/user.repository'

@Injectable()
export class RemoveFavListener {
  constructor(private readonly repository: UserRepository) {}

  @OnEvent(PostEvent.REMOVE, { suppressErrors: false })
  async post(list: string[]) {
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
