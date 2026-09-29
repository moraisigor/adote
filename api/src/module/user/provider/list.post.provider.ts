import { Injectable } from '@nestjs/common'

import { Types, type QueryFilter } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'
import { PostResponse } from '@/module/post/post.response'
import { PostRepository } from '@/module/post/repository/post.repository'
import type { Post } from '@/module/post/repository/post.schema'

import { ListPostRequest } from '../user.request'

@Injectable()
export class ListPostProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  private async list(request: ListPostRequest, query: QueryFilter<Post>): Promise<PostResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, query)

    return list.map((e) => new PostResponse(e))
  }

  async run(request: ListPostRequest, current: string): Promise<PostResponse[]> {
    const { organization } = request

    if (organization) {
      const permission = await this.provider.organization.run(current, organization)

      if (permission) {
        return await this.list(request, {
          organization: new Types.ObjectId(organization)
        })
      }
    }

    return await this.list(request, {
      user: new Types.ObjectId(current)
    })
  }
}
