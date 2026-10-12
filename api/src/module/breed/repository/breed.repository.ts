import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model, type mongo, type ProjectionType, type QueryFilter, type QueryOptions } from 'mongoose'

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

  upsert(
    list: {
      name: string
      kind: Kind
    }[]
  ): Promise<mongo.BulkWriteResult> {
    return this.model.bulkWrite(
      list.map((e) => ({
        updateOne: {
          filter: { name: e.name, kind: e.kind },
          update: { $setOnInsert: e },
          upsert: true
        }
      })),
      { ordered: false }
    )
  }
}
