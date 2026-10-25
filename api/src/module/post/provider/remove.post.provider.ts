import { Injectable } from '@nestjs/common'

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
    const find = await this.repository.find({ _id: id })

    await this.permission.resource.run(current, find)

    await this.repository.remove({ _id: id })

    return new RemovePostResponse(id)
  }
}
