import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type {
  Model,
  mongo,
  PopulateOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery
} from 'mongoose'

import { LEAN } from '@/helper/repository'

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

  async exists(query: QueryFilter<Post>): Promise<boolean> {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof mongo.WithId<Post>>(
    property: K,
    query?: QueryFilter<Post>,
    options?: QueryOptions<Post>
  ) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostView[]> {
    const { sort } = options ?? {}

    return this.model
      .find(query, projection, Object.assign({ lean: LEAN }, options))
      .skip(skip)
      .limit(limit)
      .sort(sort ?? { _id: 1 })
      .populate<PostView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostView | null> {
    return this.model
      .findOne<PostView>(query, projection, Object.assign({ lean: LEAN, populate: POPULATE }, options))
      .exec()
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
    update: UpdateQuery<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostView | null> {
    return this.model.findByIdAndUpdate(id, update, options).populate<PostView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<Post>, many: boolean = false): Promise<boolean> {
    if (many) {
      const { deletedCount: count } = await this.model.deleteMany(query).exec()

      return count >= 1
    }

    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
