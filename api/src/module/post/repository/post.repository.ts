import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import { Post, type PostView } from './post.schema'

const POPULATE: PopulateOptions[] = [
  {
    path: 'pet',
    select: 'name size gender breed',
    populate: {
      path: 'breed',
      select: 'name'
    }
  },
  { path: 'location', select: 'city state' },
  { path: 'user', select: 'name image contact' },
  { path: 'organization', select: 'name image contact' }
]

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private readonly model: Model<Post>) {}

  async exists(query: QueryFilter<Post>) {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof Post>(property: K, query?: QueryFilter<Post>, options?: QueryOptions<Post>) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostView[]> {
    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .populate<PostView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostView | null> {
    return this.model.findOne(query, projection, options).populate<PostView>(POPULATE).exec()
  }

  // prettier-ignore
  create(post: {
    image: string[]
    pet: Types.ObjectId
    user?: Types.ObjectId
    organization?: Types.ObjectId
    publish: boolean
  }): Promise<PostView> {
    return this.model
      .create(post)
      .then((model) => model.populate<PostView>(POPULATE))
  }

  save(
    id: Types.ObjectId,
    post: { [key: string]: unknown },
    options?: QueryOptions<Post>
  ): Promise<PostView | null> {
    return this.model.findByIdAndUpdate(id, post, options).populate<PostView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<Post>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
