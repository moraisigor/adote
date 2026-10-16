import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'
import { LocationRepository } from '@/module/location/repository/location.repository'
import { PermissionProvider } from '@/module/permission/provider'
import { PetRepository } from '@/module/pet/repository/pet.repository'

import { CreatePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly _pet: PetRepository,
    private readonly _location: LocationRepository,
    private readonly _image: ImageProvider,
    private readonly permission: PermissionProvider,
    private readonly repository: PostRepository
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

    const permission = await this.permission.resource.run(current, find)

    if (!permission) {
      throw new ForbiddenException()
    }

    const { image, location } = request

    const exists = await this._location.exists({ _id: location })

    if (!exists) {
      throw new BadRequestException()
    }

    const valid = await this._image.validate.run(image, ImageKind.POST, current)

    if (!valid) {
      throw new BadRequestException()
    }

    const { organization } = find

    const post = await this.repository.create(
      this.build(request, organization ? { organization } : { user: new Types.ObjectId(current) })
    )

    if (isNil(post)) {
      throw new BadRequestException()
    }

    return new PostResponse(post)
  }
}
