import { SetMetadata } from '@nestjs/common'

import type { OrganizationRole } from '@/module/organization/type/organization.role'

export const ORGANIZATION_PERMISSION = 'organization_permission'

export const OrganizationPermission = (role: OrganizationRole[]) => SetMetadata(ORGANIZATION_PERMISSION, role)
