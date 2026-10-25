import { Injectable } from '@nestjs/common'

import { PermissionProvider } from '@/module/permission/provider'

import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class GetPetProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<PetResponse> {
    const find = await this.repository.find({ _id: id })

    const pet = await this.permission.resource.run(current, find)

    return new PetResponse(pet)
  }
}
