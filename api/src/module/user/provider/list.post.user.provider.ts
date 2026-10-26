import { Injectable } from '@nestjs/common'

import { PermissionProvider } from '@/module/permission/provider'
import { PostResponse } from '@/module/post/post.response'
import { PostRepository } from '@/module/post/repository/post.repository'

import { ListPostRequest } from '../user.request'

@Injectable()
export class ListPostUserProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  async run(request: ListPostRequest, current: string): Promise<PostResponse[]> {
    const { page, amount, organization } = request

    const skip = (page - 1) * amount

    const scope = await this.permission.scope.run(current, organization)

    const list = await this.repository.list(skip, amount, scope)

    return list.map((e) => new PostResponse(e))
  }
}
