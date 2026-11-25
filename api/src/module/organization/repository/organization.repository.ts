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

import { LEAN } from '@/helper/repository'

import { Organization, type OrganizationView } from './organization.schema'

import type { OrganizationRole } from '../type/organization.role'

const POPULATE: PopulateOptions[] = [
  {
    path: 'location',
    select: 'city state'
  }
]

@Injectable()
export class OrganizationRepository {
  constructor(@InjectModel(Organization.name) private readonly model: Model<Organization>) {}

  async exists(query: QueryFilter<Organization>): Promise<boolean> {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  distinct<K extends keyof mongo.WithId<Organization>>(
    property: K,
    query?: QueryFilter<Organization>,
    options?: QueryOptions<Organization>
  ) {
    return this.model.distinct(property, query, options).exec()
  }

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Organization>,
    projection?: ProjectionType<Organization>,
    options?: QueryOptions<Organization>
  ): Promise<OrganizationView[]> {
    const { sort } = options ?? {}

    return this.model
      .find(query, projection, Object.assign({ lean: LEAN }, options))
      .skip(skip)
      .limit(limit)
      .sort(sort ?? { _id: 1 })
      .populate<OrganizationView>(POPULATE)
      .exec()
  }

  find(
    query: QueryFilter<Organization>,
    projection?: ProjectionType<Organization>,
    options?: QueryOptions<Organization>
  ): Promise<OrganizationView | null> {
    return this.model
      .findOne<OrganizationView>(
        query,
        projection,
        Object.assign({ lean: LEAN, populate: POPULATE }, options)
      )
      .exec()
  }

  create(organization: {
    name: string
    member: {
      user: Types.ObjectId
      role: OrganizationRole
    }[]
  }): Promise<OrganizationView> {
    return this.model.create(organization).then((model) => model.populate<OrganizationView>(POPULATE))
  }

  async update(query: QueryFilter<Organization>, update: UpdateQuery<Organization>): Promise<boolean> {
    const { modifiedCount: count } = await this.model.updateMany(query, update).exec()

    return count >= 1
  }

  save(
    id: Types.ObjectId,
    update: UpdateQuery<Organization>,
    options?: QueryOptions<Organization>
  ): Promise<OrganizationView | null> {
    return this.model.findByIdAndUpdate(id, update, options).populate<OrganizationView>(POPULATE).exec()
  }

  async remove(query?: QueryFilter<Organization>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
