import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { OrganizationEvent } from '../organization.event'
import { RemoveOrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class RemoveOrganizationProvider {
  constructor(
    private readonly event: EventEmitter2,
    private readonly repository: OrganizationRepository
  ) {}

  async run(id: string): Promise<RemoveOrganizationResponse> {
    const exists = await this.repository.exists({ _id: id })

    if (!exists) {
      throw new NotFoundException()
    }

    await this.event.emitAsync(OrganizationEvent.REMOVE, id)

    await this.repository.remove({ _id: id })

    return new RemoveOrganizationResponse(id)
  }
}
