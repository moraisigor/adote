import { Injectable } from '@nestjs/common'

import { OrganizationPermissionProvider } from './organization.permission.provider'
import { ResourcePermissionProvider } from './resource.permission.provider'
import { ScopePermissionProvider } from './scope.permission.provider'

@Injectable()
export class PermissionProvider {
  constructor(
    readonly scope: ScopePermissionProvider,
    readonly resource: ResourcePermissionProvider,
    readonly organization: OrganizationPermissionProvider
  ) {}
}
