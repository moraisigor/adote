import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import {
  Types,
  type Model,
  type mongo,
  type PopulateOptions,
  type ProjectionType,
  type QueryFilter,
  type QueryOptions,
  type UpdateQuery
} from 'mongoose'

import { LEAN } from '@/helper/repository'

import { User, type UserDocument, type UserView } from './user.schema'

import type { Role } from '../type/role'

const POPULATE: PopulateOptions[] = [
  {
    path: 'location',
    select: 'city state'
  }
]

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async exists(query: QueryFilter<User>): Promise<boolean> {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof mongo.WithId<User>>(
    property: K,
    query?: QueryFilter<User>,
    options?: QueryOptions<User>
  ) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserView[]> {
    const { sort } = options ?? {}

    return this.model
      .find(query, projection, Object.assign({ lean: LEAN }, options))
      .skip(skip)
      .limit(limit)
      .sort(sort ?? { _id: 1 })
      .populate<UserView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserView | null> {
    return this.model
      .findOne<UserView>(query, projection, Object.assign({ lean: LEAN, populate: POPULATE }, options))
      .exec()
  }

  // prettier-ignore
  create(user: {
    name?: string
    phone: string
    role?: Role
  }): Promise<UserDocument> {
    return this.model.create(user)
  }

  async update(query: QueryFilter<User>, update: UpdateQuery<User>): Promise<boolean> {
    const { modifiedCount: count } = await this.model.updateMany(query, update).exec()

    return count >= 1
  }

  save(
    query: Types.ObjectId | QueryFilter<User>,
    update?: UpdateQuery<User>,
    options?: QueryOptions<User>
  ): Promise<UserView | null> {
    if (query instanceof Types.ObjectId) {
      return this.model.findByIdAndUpdate(query, update, options).populate<UserView>(POPULATE).exec()
    }

    return this.model.findOneAndUpdate(query, update, options).populate<UserView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<User>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
