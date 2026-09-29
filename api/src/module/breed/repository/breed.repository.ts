import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model, type ProjectionType, type QueryFilter, type QueryOptions } from 'mongoose'

import { Breed, type BreedDocument } from './breed.schema'

import type { Kind } from '../type/kind'

@Injectable()
export class BreedRepository {
  constructor(@InjectModel(Breed.name) private readonly model: Model<Breed>) {}

  list(
    query?: QueryFilter<Breed>,
    projection?: ProjectionType<Breed>,
    options?: QueryOptions<Breed>
  ): Promise<BreedDocument[]> {
    return this.model.find(query, projection, options).exec()
  }

  // prettier-ignore
  create(list: {
    name: string,
    kind: Kind
  }[]): Promise<BreedDocument[]> {
    return this.model.insertMany(list)
  }

  async remove(query?: QueryFilter<Breed>): Promise<boolean> {
    const { acknowledged: result } = await this.model.deleteMany(query).exec()

    return result
  }
}
