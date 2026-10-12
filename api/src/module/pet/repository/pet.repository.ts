import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import type { Kind } from '@/module/breed/type/kind'

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

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Pet>,
    projection?: ProjectionType<Pet>,
    options?: QueryOptions<Pet>
  ): Promise<PetView[]> {
    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .populate<PetView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<Pet>,
    projection?: ProjectionType<Pet>,
    options?: QueryOptions<Pet>
  ): Promise<PetView | null> {
    return this.model.findOne(query, projection, options).populate<PetView>(POPULATE).exec()
  }

  // prettier-ignore
  async create(pet: {
    name: string,
    kind: Kind,
    size: Size,
    gender: Gender,
    breed: Types.ObjectId,
    user?: Types.ObjectId,
    organization?: Types.ObjectId
  }): Promise<PetView> {
    return this.model
      .create(pet)
      .then((model) => model.populate<PetView>(POPULATE))
  }

  save(
    id: Types.ObjectId,
    pet: { [key: string]: unknown },
    options?: QueryOptions<Pet>
  ): Promise<PetView | null> {
    return this.model.findByIdAndUpdate(id, pet, options).populate<PetView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<Pet>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
