import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

import { SavePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class SavePostProvider {
  constructor(
    private readonly provider: PermissionProvider,
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
      throw new BadRequestException()
    }

    const { user, organization } = post

    const permission = await new Permission(current, this.provider).run(
      user as Types.ObjectId,
      organization as Types.ObjectId
    )

    if (permission) {
      const result = await this.repository.save(new Types.ObjectId(id), this.build(request), {
        returnDocument: 'after'
      })

      if (result) {
        return new PostResponse(result)
      }
    }

    throw new BadRequestException()
  }
}
