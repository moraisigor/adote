import { Injectable } from '@nestjs/common'

import type { OrganizationRole } from '@/module/organization/type/organization.role'

import { id } from '@/helper/repository'

import { OrganizationPermissionProvider } from './organization.permission.provider'

import type { Resource } from '../type/resource'

@Injectable()
export class ResourcePermissionProvider {
  constructor(private readonly organization: OrganizationPermissionProvider) {}

  async run(current: string, resource: Resource, permission?: OrganizationRole[]): Promise<boolean> {
    const { user, organization } = resource

    if (user) {
      return id(user) === current
    }

    const value = id(organization)

    if (value) {
      return await this.organization.run(current, value, permission)
    }

    return false
  }
}
