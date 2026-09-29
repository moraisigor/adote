import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import type { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

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
      throw new BadRequestException()
    }

    const { user, organization } = pet

    const permission = await new Permission(current, this.provider).run(
      user as Types.ObjectId,
      organization as Types.ObjectId
    )

    if (permission) {
      return new PetResponse(pet)
    }

    throw new BadRequestException()
  }
}
