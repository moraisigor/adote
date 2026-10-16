import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

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

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Adopter>,
    projection?: ProjectionType<Adopter>,
    options?: QueryOptions<Adopter>
  ): Promise<AdopterView[]> {
    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .populate<AdopterView>(POPULATE)
      .exec()
  }

  save(adopter: {
    name: string
    phone: string
    pet: Types.ObjectId
    user?: Types.ObjectId
    organization?: Types.ObjectId
  }) {
    const { name, phone, pet, user, organization } = adopter

    return this.model.updateOne(
      { phone, pet },
      {
        $set: { name },
        $setOnInsert: { user, organization }
      },
      { upsert: true }
    )
  }

  async remove(query: QueryFilter<Adopter>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteMany(query).exec()

    return count >= 1
  }
}
