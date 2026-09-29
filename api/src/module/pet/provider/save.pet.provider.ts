import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

import { SavePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class SavePetProvider {
  constructor(
    private readonly provider: PermissionProvider,
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
    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new BadRequestException()
    }

    const { user, organization } = pet

    const permission = await new Permission(current, this.provider).run(
      user as Types.ObjectId,
      organization as Types.ObjectId
    )

    if (permission) {
      const result = await this.repository.save(new Types.ObjectId(id), this.build(request), {
        returnDocument: 'after'
      })

      if (result) {
        return new PetResponse(result)
      }

      throw new BadRequestException()
    }

    throw new BadRequestException()
  }
}
