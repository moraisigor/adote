import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import type { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

import { RemovePetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class RemovePetProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePetResponse> {
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
      const result = await this.repository.remove({ _id: id })

      if (result) {
        return new RemovePetResponse(id)
      }
    }

    throw new BadRequestException()
  }
}
