import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import { Organization, type OrganizationDocument } from './organization.schema'

import type { OrganizationRole } from '../type/organization.role'

@Injectable()
export class OrganizationRepository {
  constructor(@InjectModel(Organization.name) private readonly model: Model<Organization>) {}

  async exists(query: QueryFilter<Organization>) {
    const result = await this.model.exists(query).exec()

    return Boolean(result)
  }

  list(
    query?: QueryFilter<Organization>,
    projection?: ProjectionType<Organization>,
    options?: QueryOptions<Organization>
  ): Promise<OrganizationDocument[]> {
    return this.model.find(query, projection, options).exec()
  }

  find(
    query: QueryFilter<Organization>,
    projection?: ProjectionType<Organization>,
    options?: QueryOptions<Organization>
  ): Promise<OrganizationDocument | null> {
    return this.model.findOne(query, projection, options).exec()
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

  save(
    id: Types.ObjectId,
    organization: { [key: string]: unknown },
    options?: QueryOptions<Organization>
  ): Promise<OrganizationDocument | null> {
    return this.model.findByIdAndUpdate(id, organization, options).exec()
  }

  async remove(query?: QueryFilter<Organization>): Promise<boolean> {
    const { acknowledged: result } = await this.model.deleteOne(query).exec()

    return result
  }
}
