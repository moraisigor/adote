import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'
import { LocationRepository } from '@/module/location/repository/location.repository'
import { PermissionProvider } from '@/module/permission/provider'
import type { Scope } from '@/module/permission/type/scope'
import { PetRepository } from '@/module/pet/repository/pet.repository'

import { id } from '@/helper/repository'

import { CreatePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly _image: ImageProvider,
    private readonly _permission: PermissionProvider,
    private readonly _pet: PetRepository,
    private readonly _location: LocationRepository,
    private readonly repository: PostRepository
  ) {}

  private build(request: CreatePostRequest, scope: Scope) {
    const { image, pet, location, publish } = request

    return Object.assign(
      {
        image,
        pet: new Types.ObjectId(pet),
        location: new Types.ObjectId(location),
        publish
      },
      scope
    )
  }

  async run(request: CreatePostRequest, current: string): Promise<PostResponse> {
    const { pet, image, location } = request

    const find = await this._pet.find({ _id: id })

    const post = await this._permission.resource.run(current, find)

    const valid = await Promise.all([
      this._image.validate.run(image, ImageKind.POST, current),
      this._location.exists({ _id: location }),
      this.repository.exists({ pet })
    ]).then((validate) => validate.every(Boolean))

    if (!valid) {
      throw new BadRequestException()
    }

    const { organization } = post

    const scope = await this._permission.scope.run(current, id(organization))

    const result = await this.repository.create(this.build(request, scope))

    if (isNil(result)) {
      throw new BadRequestException()
    }

    return new PostResponse(result)
  }
}
