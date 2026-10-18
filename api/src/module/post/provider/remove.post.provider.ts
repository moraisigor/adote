import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { PermissionProvider } from '@/module/permission/provider'

import { RemovePostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class RemovePostProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePostResponse> {
    const post = await this.repository.find({ _id: id })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    const permission = await this.permission.resource.run(current, post)

    if (!permission) {
      throw new ForbiddenException()
    }

    const result = await this.repository.remove({ _id: id })

    if (isNil(result)) {
      throw new NotFoundException()
    }

    return new RemovePostResponse(id)
  }
}
