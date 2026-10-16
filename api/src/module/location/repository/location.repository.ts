import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model, type mongo, type ProjectionType, type QueryFilter, type QueryOptions } from 'mongoose'

import { Location, type LocationDocument } from './location.schema'

@Injectable()
export class LocationRepository {
  constructor(@InjectModel(Location.name) private readonly model: Model<Location>) {}

  async exists(query: QueryFilter<Location>) {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  list(
    query?: QueryFilter<Location>,
    projection?: ProjectionType<Location>,
    options?: QueryOptions<Location>
  ): Promise<LocationDocument[]> {
    return this.model.find(query, projection, options).exec()
  }

  create(
    list: {
      city: string
      state: string
      search: string
    }[]
  ): Promise<mongo.BulkWriteResult> {
    return this.model.bulkWrite(
      list.map((e) => ({
        updateOne: {
          filter: { city: e.city, state: e.state },
          update: { $set: { search: e.search }, $setOnInsert: { city: e.city, state: e.state } },
          upsert: true
        }
      })),
      { ordered: false }
    )
  }
}
