import { Module } from '@nestjs/common'

import { PermissionProvider } from './provider'
import { OrganizationPermissionProvider } from './provider/organization.permission.provider'
import { ResourcePermissionProvider } from './provider/resource.permission.provider'

import { OrganizationModule } from '../organization/organization.module'

@Module({
  imports: [OrganizationModule],
  exports: [PermissionProvider],
  providers: [PermissionProvider, ResourcePermissionProvider, OrganizationPermissionProvider]
})
export class PermissionModule {}
