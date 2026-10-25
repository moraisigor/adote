import { Injectable } from '@nestjs/common'

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
    const find = await this.repository.find({ _id: id })

    await this.permission.resource.run(current, find)

    await this.repository.remove({ _id: id })

    await this._post.remove({ pet: id })
    await this._adopter.remove({ pet: id })

    return new RemovePetResponse(id)
  }
}
