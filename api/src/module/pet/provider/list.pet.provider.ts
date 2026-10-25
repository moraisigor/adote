import { Injectable } from '@nestjs/common'

import { PermissionProvider } from '@/module/permission/provider'

import { ListPetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class ListPetProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(request: ListPetRequest, current: string): Promise<PetResponse[]> {
    const { page, amount, organization } = request

    const skip = (page - 1) * amount

    const scope = await this.permission.scope.run(current, organization)

    const list = await this.repository.list(skip, amount, scope)

    return list.map((e) => new PetResponse(e))
  }
}
