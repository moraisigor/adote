import { BadRequestException, Injectable } from '@nestjs/common'

import { difference, isNil } from 'lodash-es'
import { Types } from 'mongoose'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'
import { LocationRepository } from '@/module/location/repository/location.repository'
import { PermissionProvider } from '@/module/permission/provider'

import { SavePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class SavePostProvider {
  constructor(
    private readonly image: ImageProvider,
    private readonly permission: PermissionProvider,
    private readonly _location: LocationRepository,
    private readonly repository: PostRepository
  ) {}

  private build(request: SavePostRequest) {
    const { image, location, publish } = request

    return {
      image,
      location: new Types.ObjectId(location),
      publish
    }
  }

  async run(id: string, request: SavePostRequest, current: string): Promise<PostResponse> {
    const { image, location } = request

    const find = await this.repository.find({ _id: id }, 'image user organization', { populate: [] })

    const post = await this.permission.resource.run(current, find)

    const valid = await Promise.all([
      this.image.validate.run(difference(image, post.image), ImageKind.POST, current),
      this._location.exists({ _id: location })
    ]).then((validate) => validate.every(Boolean))

    if (!valid) {
      throw new BadRequestException()
    }

    const result = await this.repository.save(new Types.ObjectId(id), this.build(request), {
      returnDocument: 'after'
    })

    if (isNil(result)) {
      throw new BadRequestException()
    }

    return new PostResponse(result)
  }
}
