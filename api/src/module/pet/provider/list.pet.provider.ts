import { Injectable } from '@nestjs/common'

import { Types, type QueryFilter } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { ListPetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'
import type { Pet } from '../repository/pet.schema'

@Injectable()
export class ListPetProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  private async list(request: ListPetRequest, query: QueryFilter<Pet>): Promise<PetResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, query)

    return list.map((e) => new PetResponse(e))
  }

  async run(request: ListPetRequest, current: string): Promise<PetResponse[]> {
    const { organization } = request

    if (organization) {
      const permission = await this.provider.organization.run(current, organization)

      if (permission) {
        return await this.list(request, {
          organization: new Types.ObjectId(organization)
        })
      }
    }

    return await this.list(request, {
      user: new Types.ObjectId(current)
    })
  }
}
