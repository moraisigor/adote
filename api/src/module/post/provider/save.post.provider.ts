import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { difference, isNil } from 'lodash'
import { Types } from 'mongoose'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'
import { PermissionProvider } from '@/module/permission/provider'

import { SavePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'
import type { PostView } from '../repository/post.schema'

@Injectable()
export class SavePostProvider {
  image = {
    remove: ({ image }: PostView, { image: next }: SavePostRequest) => {
      return this._image.remove.run(difference(image, next))
    },
    validate: ({ image }: PostView, { image: next }: SavePostRequest, current: string) => {
      return this._image.validate.run(difference(next, image), ImageKind.POST, current)
    }
  }

  constructor(
    private readonly _image: ImageProvider,
    private readonly permission: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  private build(request: SavePostRequest): { [key: string]: unknown } {
    const { image, location, publish } = request

    return {
      image,
      location: new Types.ObjectId(location),
      publish
    }
  }

  async run(id: string, request: SavePostRequest, current: string): Promise<PostResponse> {
    const post = await this.repository.find({ _id: id })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    const permission = await this.permission.resource.run(current, post)

    if (permission) {
      const valid = await this.image.validate(post, request, current)

      if (valid) {
        const result = await this.repository.save(new Types.ObjectId(id), this.build(request), {
          returnDocument: 'after'
        })

        if (result) {
          await this.image.remove(post, request)

          return new PostResponse(result)
        }

        throw new BadRequestException()
      }

      throw new BadRequestException()
    }

    throw new ForbiddenException()
  }
}
