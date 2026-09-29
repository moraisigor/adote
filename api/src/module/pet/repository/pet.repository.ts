import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import type { Kind } from '@/module/breed/type/kind'

import { Pet, type PetDocument } from './pet.schema'

import type { Gender } from '../type/gender'
import type { Size } from '../type/size'

@Injectable()
export class PetRepository {
  constructor(@InjectModel(Pet.name) private readonly model: Model<Pet>) {}

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Pet>,
    projection?: ProjectionType<Pet>,
    options?: QueryOptions<Pet>
  ): Promise<PetDocument[]> {
    return this.model
      .find(query, projection, options)
      .skip(skip)
      .limit(limit)
      .populate([{ path: 'breed' }])
      .exec()
  }

  find(
    query: QueryFilter<Pet>,
    projection?: ProjectionType<Pet>,
    options?: QueryOptions<Pet>
  ): Promise<PetDocument | null> {
    return this.model
      .findOne(query, projection, options)
      .populate([{ path: 'breed' }])
      .exec()
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
  }): Promise<PetDocument> {
    const model = await this.model.create(pet)

    return model.populate([
      { path: 'breed' },
    ])
  }

  save(
    id: Types.ObjectId,
    pet: { [key: string]: unknown },
    options?: QueryOptions<Pet>
  ): Promise<PetDocument | null> {
    return this.model
      .findByIdAndUpdate(id, pet, options)
      .populate([{ path: 'breed' }])
      .exec()
  }

  async remove(query?: QueryFilter<Pet>): Promise<boolean> {
    const { acknowledged: result } = await this.model.deleteOne(query).exec()

    return result
  }
}
