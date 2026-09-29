import { SetMetadata } from '@nestjs/common'

import type { OrganizationRole } from '@/module/organization/type/organization.role'

export const OrganizationPermission = (role: OrganizationRole[]) =>
  SetMetadata('organization_permission', role)
