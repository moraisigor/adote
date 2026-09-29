import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import { Post, type PostDocument } from './post.schema'

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private readonly model: Model<Post>) {}

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostDocument[]> {
    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'pet', populate: { path: 'breed' } },
        { path: 'location' },
        { path: 'user', populate: { path: 'contact' } },
        { path: 'organization', populate: { path: 'contact' } }
      ])
      .exec()
  }

  find(
    query: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostDocument | null> {
    return this.model
      .findOne(query, projection, options)
      .populate([
        { path: 'pet', populate: { path: 'breed' } },
        { path: 'location' },
        { path: 'user', populate: { path: 'contact' } },
        { path: 'organization', populate: { path: 'contact' } }
      ])
      .exec()
  }

  // prettier-ignore
  create(post: {
    image: string[]
    pet: Types.ObjectId
    user?: Types.ObjectId
    organization?: Types.ObjectId
    publish: boolean
  }): Promise<PostDocument> {
    return this.model
      .create(post)
      .then((model) =>
        model.populate([
          { path: 'pet', populate: { path: 'breed' } },
          { path: 'location' },
          { path: 'user', populate: { path: 'contact' } },
          { path: 'organization', populate: { path: 'contact' } }
        ])
      )
  }

  save(
    id: Types.ObjectId,
    post: { [key: string]: unknown },
    options?: QueryOptions<Post>
  ): Promise<PostDocument | null> {
    return this.model
      .findByIdAndUpdate(id, post, options)
      .populate([
        { path: 'pet', populate: { path: 'breed' } },
        { path: 'location' },
        { path: 'user', populate: { path: 'contact' } },
        { path: 'organization', populate: { path: 'contact' } }
      ])
      .exec()
  }

  async remove(query?: QueryFilter<Post>): Promise<boolean> {
    const { acknowledged: result } = await this.model.deleteOne(query).exec()

    return result
  }
}
