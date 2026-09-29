import { Injectable } from '@nestjs/common'

import { CreatePostProvider } from './create.post.provider'
import { GetPostProvider } from './get.post.provider'
import { ListPostProvider } from './list.post.provider'
import { PublishPostProvider } from './publish.post.provider'
import { RemovePostProvider } from './remove.post.provider'
import { SavePostProvider } from './save.post.provider'

@Injectable()
export class PostProvider {
  constructor(
    readonly get: GetPostProvider,
    readonly list: ListPostProvider,
    readonly create: CreatePostProvider,
    readonly save: SavePostProvider,
    readonly publish: PublishPostProvider,
    readonly remove: RemovePostProvider
  ) {}
}
