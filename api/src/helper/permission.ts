import { Types } from 'mongoose'

import { OrganizationRole } from '@/module/organization/type/organization.role'
import { PermissionProvider } from '@/module/permission/provider'

export class Permission {
  constructor(
    private readonly current: string,
    private readonly provider: PermissionProvider
  ) {}

  async run(user?: Types.ObjectId, organization?: Types.ObjectId, permission?: OrganizationRole[]) {
    if (user) {
      return user.equals(new Types.ObjectId(this.current))
    }

    if (organization) {
      return await this.provider.organization.run(this.current, String(organization), permission)
    }

    return false
  }
}
