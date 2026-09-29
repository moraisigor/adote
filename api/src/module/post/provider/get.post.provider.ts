import { BadRequestException, Injectable } from '@nestjs/common'

import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class GetPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(id: string): Promise<PostResponse> {
    const post = await this.repository.find({ _id: id, publish: true })

    if (post) {
      return new PostResponse(post)
    }

    throw new BadRequestException()
  }
}
