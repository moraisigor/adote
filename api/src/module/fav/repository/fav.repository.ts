import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model, Types, type ProjectionType, type QueryOptions } from 'mongoose'

import { User, type UserDocument } from '@/module/user/repository/user.schema'

@Injectable()
export class FavRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  find(
    id: Types.ObjectId,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
  ): Promise<UserDocument | null> {
    return this.model.findById(id, projection, options).exec()
  }

  add(
    post: Types.ObjectId,
    user: Types.ObjectId,
    options?: QueryOptions<User>
  ): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(user, { $addToSet: { fav: post } }, options).exec()
  }

  remove(
    post: Types.ObjectId,
    user: Types.ObjectId,
    options?: QueryOptions<User>
  ): Promise<UserDocument | null> {
    return this.model.findOneAndUpdate({ _id: user, fav: post }, { $pull: { fav: post } }, options).exec()
  }
}
