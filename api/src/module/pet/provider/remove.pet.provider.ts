import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { PermissionProvider } from '@/module/permission/provider'

import { PetEvent } from '../pet.event'
import { RemovePetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class RemovePetProvider {
  constructor(
    private readonly event: EventEmitter2,
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePetResponse> {
    const find = await this.repository.find({ _id: id })

    await this.permission.resource.run(current, find)

    await this.event.emitAsync(PetEvent.REMOVE, id)

    await this.repository.remove({ _id: id })

    return new RemovePetResponse(id)
  }
}
