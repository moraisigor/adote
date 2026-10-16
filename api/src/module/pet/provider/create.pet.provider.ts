import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { PermissionProvider } from '@/module/permission/provider'

import { CreatePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class CreatePetProvider {
  constructor(
    private readonly _breed: BreedRepository,
    private readonly permission: PermissionProvider,
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
    const { kind, breed, organization } = request

    if (organization) {
      const permission = await this.permission.organization.run(current, organization)

      if (!permission) {
        throw new ForbiddenException()
      }

      const exists = await this._breed.exists({ _id: breed, kind })

      if (!exists) {
        throw new BadRequestException()
      }

      const pet = await this.repository.create(
        this.build(request, { organization: new Types.ObjectId(organization) })
      )

      if (isNil(pet)) {
        throw new BadRequestException()
      }

      return new PetResponse(pet)
    }

    const exists = await this._breed.exists({ _id: breed, kind })

    if (!exists) {
      throw new BadRequestException()
    }

    const pet = await this.repository.create(this.build(request, { user: new Types.ObjectId(current) }))

    if (isNil(pet)) {
      throw new BadRequestException()
    }

    return new PetResponse(pet)
  }
}
