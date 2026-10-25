import { ForbiddenException, Injectable } from '@nestjs/common'

import type { OrganizationRole } from '@/module/organization/type/organization.role'

import { id } from '@/helper/repository'

import { OrganizationPermissionProvider } from './organization.permission.provider'

import type { Resource } from '../type/resource'

@Injectable()
export class ResourcePermissionProvider {
  constructor(private readonly organization: OrganizationPermissionProvider) {}

  private async permission(
    current: string,
    resource: Resource,
    permission?: OrganizationRole[]
  ): Promise<boolean> {
    const { user, organization } = resource

    if (user) {
      return id(user) === current
    }

    if (organization) {
      return await this.organization.run(current, id(organization)!, permission)
    }

    return false
  }

  async run(current: string, resource: Resource, permission?: OrganizationRole[]): Promise<void> {
    const is = await this.permission(current, resource, permission)

    if (!is) {
      throw new ForbiddenException()
    }
  }
}
