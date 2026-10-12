import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import type { OrganizationRole } from '@/module/organization/type/organization.role'

import { OrganizationPermissionProvider } from './organization.permission.provider'

import type { Ref, Resource } from '../type/resource'

@Injectable()
export class ResourcePermissionProvider {
  constructor(private readonly organization: OrganizationPermissionProvider) {}

  private id(reference: Ref): string {
    if (reference instanceof Types.ObjectId) {
      return String(reference)
    }

    const { id } = reference

    return id
  }

  async run(current: string, resource: Resource, permission?: OrganizationRole[]): Promise<boolean> {
    const { user, organization } = resource

    if (user) {
      return this.id(user) === current
    }

    if (organization) {
      return await this.organization.run(current, this.id(organization), permission)
    }

    return false
  }
}
