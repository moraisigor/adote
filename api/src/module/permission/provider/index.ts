import { Injectable } from '@nestjs/common'

import { OrganizationPermissionProvider } from './organization.permission.provider'
import { ResourcePermissionProvider } from './resource.permission.provider'

@Injectable()
export class PermissionProvider {
  constructor(
    readonly resource: ResourcePermissionProvider,
    readonly organization: OrganizationPermissionProvider
  ) {}
}
