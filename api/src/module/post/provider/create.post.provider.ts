import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'
import { PetRepository } from '@/module/pet/repository/pet.repository'

import { CreatePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly _pet: PetRepository,
    private readonly _post: PostRepository,
    private readonly provider: PermissionProvider
  ) {}

  private build(request: CreatePostRequest, param: { [key: string]: unknown }) {
    const { image, pet, location, publish } = request

    return Object.assign(
      {
        image,
        pet: new Types.ObjectId(pet),
        location: new Types.ObjectId(location),
        publish
      },
      param
    )
  }

  async run(request: CreatePostRequest, current: string): Promise<PostResponse> {
    const { pet } = request

    const find = await this._pet.find({ _id: pet })

    if (isNil(find)) {
      throw new NotFoundException()
    }

    const { organization } = find

    const permission = await this.provider.resource.run(current, find)

    if (permission) {
      const post = await this._post.create(
        this.build(request, organization ? { organization } : { user: new Types.ObjectId(current) })
      )

      return new PostResponse(post)
    }

    throw new ForbiddenException()
  }
}
