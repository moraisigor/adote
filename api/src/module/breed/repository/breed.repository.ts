import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model, type mongo, type ProjectionType, type QueryFilter, type QueryOptions } from 'mongoose'

import { LEAN } from '@/helper/repository'

import { Breed, type BreedDocument } from './breed.schema'

import type { Kind } from '../type/kind'

@Injectable()
export class BreedRepository {
  constructor(@InjectModel(Breed.name) private readonly model: Model<Breed>) {}

  async exists(query: QueryFilter<Breed>): Promise<boolean> {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof mongo.WithId<Breed>>(
    property: K,
    query?: QueryFilter<Breed>,
    options?: QueryOptions<Breed>
  ) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    query?: QueryFilter<Breed>,
    projection?: ProjectionType<Breed>,
    options?: QueryOptions<Breed>
  ): Promise<BreedDocument[]> {
    return this.model.find(query, projection, Object.assign({ lean: LEAN }, options)).exec()
  }

  create(
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
