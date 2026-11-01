import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { OrganizationEvent } from '@/module/organization/organization.event'
import { UserEvent } from '@/module/user/user.event'

import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class RemovePetListener {
  constructor(private readonly repository: PetRepository) {}

  @OnEvent(UserEvent.REMOVE, { suppressErrors: false })
  async user(user: string) {
    await this.repository.remove({ user }, true)
  }

  @OnEvent(OrganizationEvent.REMOVE, { suppressErrors: false })
  async organization(organization: string) {
    await this.repository.remove({ organization }, true)
  }
}
