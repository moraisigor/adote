import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import { User, type UserDocument } from './user.schema'

import type { Role } from '../type/role'

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  list(
    query?: QueryFilter<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserDocument[]> {
    return this.model
      .find(query, projection, options)
      .populate([{ path: 'contact' }, { path: 'location' }])
      .exec()
  }

  find(
    query: QueryFilter<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserDocument | null> {
    return this.model
      .findOne(query, projection, options)
      .populate([{ path: 'contact' }, { path: 'location' }])
      .exec()
  }

  // prettier-ignore
  create(user: {
    key: string,
    name?: string,
    phone: string,    
    role?: Role
  }): Promise<UserDocument> {
    return this.model.create(user)
  }

  save(
    id: Types.ObjectId,
    user: { [key: string]: unknown },
    options?: QueryOptions<User>
  ): Promise<UserDocument | null> {
    return this.model
      .findByIdAndUpdate(id, user, options)
      .populate([{ path: 'contact' }, { path: 'location' }])
      .exec()
  }

  async remove(query?: QueryFilter<User>): Promise<boolean> {
    const { acknowledged: result } = await this.model.deleteOne(query).exec()

    return result
  }
}
