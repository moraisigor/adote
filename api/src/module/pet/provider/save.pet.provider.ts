import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { PermissionProvider } from '@/module/permission/provider'

import { SavePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class SavePetProvider {
  constructor(
    private readonly _breed: BreedRepository,
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  private build(request: SavePetRequest): { [key: string]: unknown } {
    const { name, kind, size, gender, breed } = request

    return {
      name,
      kind,
      size,
      gender,
      breed: new Types.ObjectId(breed)
    }
  }

  async run(id: string, request: SavePetRequest, current: string): Promise<PetResponse> {
    const { kind, breed } = request

    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new NotFoundException()
    }

    await this.permission.resource.run(current, pet)

    const exists = await this._breed.exists({ _id: breed, kind })

    if (!exists) {
      throw new BadRequestException()
    }

    const result = await this.repository.save(new Types.ObjectId(id), this.build(request), {
      returnDocument: 'after'
    })

    if (isNil(result)) {
      throw new BadRequestException()
    }

    return new PetResponse(result)
  }
}
