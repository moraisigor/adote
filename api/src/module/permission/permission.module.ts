import { Module } from '@nestjs/common'

import { PermissionProvider } from './provider'
import { OrganizationPermissionProvider } from './provider/organization.permission.provider'

import { OrganizationModule } from '../organization/organization.module'

@Module({
  imports: [OrganizationModule],
  exports: [PermissionProvider],
  providers: [PermissionProvider, OrganizationPermissionProvider]
})
export class PermissionModule {}
