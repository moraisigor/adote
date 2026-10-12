import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { PublishPostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class PublishPostProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  async run(id: string, publish: boolean, current: string): Promise<PublishPostResponse> {
    const post = await this.repository.find({ _id: id })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    const permission = await this.provider.resource.run(current, post)

    if (permission) {
      const result = await this.repository.save(
        new Types.ObjectId(id),
        { publish },
        { returnDocument: 'after' }
      )

      if (result) {
        return new PublishPostResponse(result)
      }

      throw new NotFoundException()
    }

    throw new ForbiddenException()
  }
}
