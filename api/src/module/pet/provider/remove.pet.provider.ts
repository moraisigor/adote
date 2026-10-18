import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { AdopterRepository } from '@/module/adopter/repository/adopter.repository'
import { PermissionProvider } from '@/module/permission/provider'
import { PostRepository } from '@/module/post/repository/post.repository'

import { RemovePetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class RemovePetProvider {
  constructor(
    private readonly _post: PostRepository,
    private readonly _adopter: AdopterRepository,
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePetResponse> {
    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new NotFoundException()
    }

    const permission = await this.permission.resource.run(current, pet)

    if (!permission) {
      throw new ForbiddenException()
    }

    const result = await this.repository.remove({ _id: id })

    if (isNil(result)) {
      throw new NotFoundException()
    }

    await this._post.remove({ pet: id })

    await this._adopter.remove({ pet: id })

    return new RemovePetResponse(id)
  }
}
