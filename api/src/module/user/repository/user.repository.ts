import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type {
  Model,
  PopulateOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery
} from 'mongoose'

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

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserView[]> {
    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .populate<UserView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserView | null> {
    return this.model.findOne(query, projection, options).populate<UserView>(POPULATE).exec()
  }

  // prettier-ignore
  create(user: {
    name?: string
    phone: string
    role?: Role
  }): Promise<UserDocument> {
    return this.model.create(user)
  }

  update(
    query?: QueryFilter<User>,
    update?: UpdateQuery<User>,
    options?: QueryOptions<User>
  ): Promise<UserDocument | null> {
    return this.model.findOneAndUpdate(query, update, options).exec()
  }

  save(
    id: Types.ObjectId,
    user: { [key: string]: unknown },
    options?: QueryOptions<User>
  ): Promise<UserView | null> {
    return this.model.findByIdAndUpdate(id, user, options).populate<UserView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<User>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
