import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class GetPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(id: string): Promise<PostResponse> {
    const post = await this.repository.find({ _id: id, publish: true })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    return new PostResponse(post)
  }
}
