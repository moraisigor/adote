import { Module } from '@nestjs/common'

import { OrganizationModule } from '@/module/organization/organization.module'

import { PermissionProvider } from './provider'
import { OrganizationPermissionProvider } from './provider/organization.permission.provider'
import { ResourcePermissionProvider } from './provider/resource.permission.provider'

@Module({
  imports: [OrganizationModule],
  exports: [PermissionProvider],
  providers: [OrganizationPermissionProvider, PermissionProvider, ResourcePermissionProvider]
})
export class PermissionModule {}
