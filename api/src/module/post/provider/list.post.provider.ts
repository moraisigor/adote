import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { ListPostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class ListPostProvider {
  constructor(private readonly repository: PostRepository) {}

  private object = (location: string[]) => location.map((e) => new Types.ObjectId(e))

  async run(request: ListPostRequest): Promise<PostResponse[]> {
    const { page, amount, location, organization } = request

    const skip = (page - 1) * amount

    const query = Object.assign(
      { publish: true },
      location && { location: { $in: this.object(location) } },
      organization && { organization: new Types.ObjectId(organization) }
    )

    const list = await this.repository.list(skip, amount, query, {}, { sort: { create: 1 } })

    return list.map((e) => new PostResponse(e))
  }
}
