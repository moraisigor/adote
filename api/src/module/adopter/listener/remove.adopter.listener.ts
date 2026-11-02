import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { OrganizationEvent } from '@/module/organization/organization.event'
import { PetEvent } from '@/module/pet/pet.event'
import { UserEvent } from '@/module/user/user.event'

import { AdopterRepository } from '../repository/adopter.repository'

@Injectable()
export class RemoveAdopterListener {
  constructor(private readonly repository: AdopterRepository) {}

  @OnEvent(PetEvent.REMOVE, { suppressErrors: false })
  async pet(pet: string) {
    await this.repository.remove({ pet })
  }

  @OnEvent(UserEvent.REMOVE, { suppressErrors: false })
  async user(user: string) {
    await this.repository.remove({ user })
  }

  @OnEvent(OrganizationEvent.REMOVE, { suppressErrors: false })
  async organization(organization: string) {
    await this.repository.remove({ organization })
  }
}
