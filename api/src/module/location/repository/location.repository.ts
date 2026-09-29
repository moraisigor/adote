import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model, type ProjectionType, type QueryFilter, type QueryOptions } from 'mongoose'

import { Location, type LocationDocument } from './location.schema'

@Injectable()
export class LocationRepository {
  constructor(@InjectModel(Location.name) private readonly model: Model<Location>) {}

  list(
    query?: QueryFilter<Location>,
    projection?: ProjectionType<Location>,
    options?: QueryOptions<Location>
  ): Promise<LocationDocument[]> {
    return this.model.find(query, projection, options).exec()
  }

  // prettier-ignore
  create(list: {
    city: string,
    state: string
  }[]): Promise<LocationDocument[]> {
    return this.model.insertMany(list)
  }

  async remove(query?: QueryFilter<Location>): Promise<boolean> {
    const { acknowledged: result } = await this.model.deleteMany(query).exec()

    return result
  }
}
