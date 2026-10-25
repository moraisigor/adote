import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { PublishPostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class PublishPostProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  async run(id: string, publish: boolean, current: string): Promise<PublishPostResponse> {
    const find = await this.repository.find({ _id: id })

    await this.permission.resource.run(current, find)

    const result = await this.repository.save(
      new Types.ObjectId(id),
      { publish },
      { returnDocument: 'after' }
    )

    if (isNil(result)) {
      throw new NotFoundException()
    }

    return new PublishPostResponse(result)
  }
}
