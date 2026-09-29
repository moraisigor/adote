import { Injectable } from '@nestjs/common'

import { OrganizationPermissionProvider } from './organization.permission.provider'

@Injectable()
export class PermissionProvider {
  constructor(readonly organization: OrganizationPermissionProvider) {}
}
