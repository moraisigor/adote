import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

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
      throw new BadRequestException()
    }

    const { user, organization } = post

    const permission = await new Permission(current, this.provider).run(
      user as Types.ObjectId,
      organization as Types.ObjectId
    )

    if (permission) {
      const result = await this.repository.save(
        new Types.ObjectId(id),
        { publish },
        { returnDocument: 'after' }
      )

      if (result) {
        return new PublishPostResponse(result)
      }

      throw new BadRequestException()
    }

    throw new BadRequestException()
  }
}
