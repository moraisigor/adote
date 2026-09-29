import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import type { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

import { RemovePostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class RemovePostProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePostResponse> {
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
      const result = await this.repository.remove({ _id: id })

      if (result) {
        return new RemovePostResponse(id)
      }
    }

    throw new BadRequestException()
  }
}
