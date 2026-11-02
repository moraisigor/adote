import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'

import type { QueryFilter } from 'mongoose'

import { OrganizationEvent } from '@/module/organization/organization.event'
import { PetEvent } from '@/module/pet/pet.event'
import { UserEvent } from '@/module/user/user.event'

import { PostEvent } from '../post.event'
import { PostRepository } from '../repository/post.repository'
import type { Post } from '../repository/post.schema'

@Injectable()
export class RemovePostListener {
  constructor(
    private readonly event: EventEmitter2,
    private readonly repository: PostRepository
  ) {}

  private async remove(query: QueryFilter<Post>) {
    const list = await this.repository.distinct('_id', query)

    if (list.length) {
      await this.event.emitAsync(
        PostEvent.REMOVE,
        list.map((e) => String(e))
      )

      await this.repository.remove(query, true)
    }
  }

  @OnEvent(PetEvent.REMOVE, { suppressErrors: false })
  async pet(pet: string) {
    await this.remove({ pet })
  }

  @OnEvent(UserEvent.REMOVE, { suppressErrors: false })
  async user(user: string) {
    await this.remove({ user })
  }

  @OnEvent(OrganizationEvent.REMOVE, { suppressErrors: false })
  async organization(organization: string) {
    await this.remove({ organization })
  }
}
