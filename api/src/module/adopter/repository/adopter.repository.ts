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
  UpdateWriteOpResult
} from 'mongoose'

import { Adopter, type AdopterView } from './adopter.schema'

const POPULATE: PopulateOptions[] = [
  {
    path: 'pet',
    select: 'name'
  }
]

@Injectable()
export class AdopterRepository {
  constructor(@InjectModel(Adopter.name) private readonly model: Model<Adopter>) {}

  async exists(query: QueryFilter<Adopter>): Promise<boolean> {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof mongo.WithId<Adopter>>(
    property: K,
    query?: QueryFilter<Adopter>,
    options?: QueryOptions<Adopter>
  ) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Adopter>,
    projection?: ProjectionType<Adopter>,
    options?: QueryOptions<Adopter>
  ): Promise<AdopterView[]> {
    const { sort } = options ?? {}

    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .sort(sort ?? { _id: 1 })
      .populate<AdopterView>(POPULATE)
      .exec()
  }

  save(adopter: {
    name: string
    phone: string
    pet: Types.ObjectId
    user?: Types.ObjectId
    organization?: Types.ObjectId
  }): Promise<UpdateWriteOpResult> {
    const { name, phone, pet, user, organization } = adopter

    return this.model
      .updateOne({ phone, pet }, { $setOnInsert: { name, user, organization } }, { upsert: true })
      .exec()
  }

  async remove(query: QueryFilter<Adopter>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteMany(query).exec()

    return count >= 1
  }
}
