import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, mongo, ProjectionType, QueryFilter, QueryOptions, Types, UpdateQuery } from 'mongoose'

import { LEAN } from '@/helper/repository'

import { Organization, type OrganizationDocument } from './organization.schema'

import type { OrganizationRole } from '../type/organization.role'

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
  ): Promise<OrganizationDocument[]> {
    const { sort } = options ?? {}

    return this.model
      .find(query, projection, Object.assign({ lean: LEAN }, options))
      .skip(skip)
      .limit(limit)
      .sort(sort ?? { _id: 1 })
      .exec()
  }

  find(
    query: QueryFilter<Organization>,
    projection?: ProjectionType<Organization>,
    options?: QueryOptions<Organization>
  ): Promise<OrganizationDocument | null> {
    return this.model.findOne(query, projection, Object.assign({ lean: LEAN }, options)).exec()
  }

  create(organization: {
    name: string
    member: {
      user: Types.ObjectId
      role: OrganizationRole
    }[]
  }): Promise<OrganizationDocument> {
    return this.model.create(organization)
  }

  async update(query: QueryFilter<Organization>, update: UpdateQuery<Organization>): Promise<boolean> {
    const { modifiedCount: count } = await this.model.updateMany(query, update).exec()

    return count >= 1
  }

  save(
    id: Types.ObjectId,
    organization: { [key: string]: unknown },
    options?: QueryOptions<Organization>
  ): Promise<OrganizationDocument | null> {
    return this.model.findByIdAndUpdate(id, organization, options).exec()
  }

  async remove(query?: QueryFilter<Organization>): Promise<boolean> {
    const { deletedCount: count } = await this.model.deleteOne(query).exec()

    return count >= 1
  }
}
