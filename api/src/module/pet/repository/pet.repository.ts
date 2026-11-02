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
  UpdateQuery
} from 'mongoose'

import type { Kind } from '@/module/breed/type/kind'

import { LEAN } from '@/helper/repository'

import { Pet, type PetView } from './pet.schema'

import type { Gender } from '../type/gender'
import type { Size } from '../type/size'

const POPULATE: PopulateOptions[] = [
  {
    path: 'breed',
    select: 'name'
  }
]

@Injectable()
export class PetRepository {
  constructor(@InjectModel(Pet.name) private readonly model: Model<Pet>) {}

  async exists(query: QueryFilter<Pet>): Promise<boolean> {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof mongo.WithId<Pet>>(
    property: K,
    query?: QueryFilter<Pet>,
    options?: QueryOptions<Pet>
  ) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Pet>,
    projection?: ProjectionType<Pet>,
    options?: QueryOptions<Pet>
  ): Promise<PetView[]> {
    const { sort } = options ?? {}

    return this.model
      .find(query, projection, Object.assign({ lean: LEAN }, options))
      .skip(skip)
      .limit(limit)
      .sort(sort ?? { _id: 1 })
      .populate<PetView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<Pet>,
    projection?: ProjectionType<Pet>,
    options?: QueryOptions<Pet>
  ): Promise<PetView | null> {
    return this.model
      .findOne<PetView>(query, projection, Object.assign({ lean: LEAN, populate: POPULATE }, options))
      .exec()
  }

  // prettier-ignore
  async create(pet: {
    name: string
    kind: Kind
    size: Size
    gender: Gender
    breed: Types.ObjectId
    user?: Types.ObjectId
    organization?: Types.ObjectId
  }): Promise<PetView> {
    return this.model
      .create(pet)
      .then((model) => model.populate<PetView>(POPULATE))
  }

  save(id: Types.ObjectId, update: UpdateQuery<Pet>, options?: QueryOptions<Pet>): Promise<PetView | null> {
    return this.model.findByIdAndUpdate(id, update, options).populate<PetView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<Pet>, many: boolean = false): Promise<boolean> {
    if (many) {
      const { deletedCount: count } = await this.model.deleteMany(query).exec()

      return count >= 1
    }

    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
