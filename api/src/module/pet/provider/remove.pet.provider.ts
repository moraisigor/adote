import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { PermissionProvider } from '@/module/permission/provider'

import { RemovePetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class RemovePetProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePetResponse> {
    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new NotFoundException()
    }

    const permission = await this.provider.resource.run(current, pet)

    if (permission) {
      const result = await this.repository.remove({ _id: id })

      if (result) {
        return new RemovePetResponse(id)
      }

      throw new NotFoundException()
    }

    throw new ForbiddenException()
  }
}
