import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { CreatePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class CreatePetProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  private build(request: CreatePetRequest, param: { [key: string]: unknown }) {
    const { name, kind, size, gender, breed } = request

    return Object.assign(
      {
        name,
        kind,
        size,
        gender,
        breed: new Types.ObjectId(breed)
      },
      param
    )
  }

  async run(request: CreatePetRequest, current: string): Promise<PetResponse> {
    const { organization } = request

    if (organization) {
      const permission = await this.provider.organization.run(current, organization)

      if (permission) {
        const pet = await this.repository.create(
          this.build(request, { organization: new Types.ObjectId(organization) })
        )

        return new PetResponse(pet)
      }
    }

    const pet = await this.repository.create(this.build(request, { user: new Types.ObjectId(current) }))

    return new PetResponse(pet)
  }
}
