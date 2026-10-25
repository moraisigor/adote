import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { PermissionProvider } from '@/module/permission/provider'
import type { Scope } from '@/module/permission/type/scope'

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

  private build(request: CreatePetRequest, scope: Scope) {
    const { name, kind, size, gender, breed } = request

    return Object.assign(
      {
        name,
        kind,
        size,
        gender,
        breed: new Types.ObjectId(breed)
      },
      scope
    )
  }

  async run(request: CreatePetRequest, current: string): Promise<PetResponse> {
    const { kind, breed, organization } = request

    const exists = await this._breed.exists({ _id: breed, kind })

    if (!exists) {
      throw new BadRequestException()
    }

    const scope = await this.permission.scope.run(current, organization)

    const pet = await this.repository.create(this.build(request, scope))

    if (isNil(pet)) {
      throw new BadRequestException()
    }

    return new PetResponse(pet)
  }
}
