import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { PermissionProvider } from '@/module/permission/provider'

import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class GetPetProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<PetResponse> {
    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new NotFoundException()
    }

    const permission = await this.provider.resource.run(current, pet)

    if (permission) {
      return new PetResponse(pet)
    }

    throw new ForbiddenException()
  }
}
