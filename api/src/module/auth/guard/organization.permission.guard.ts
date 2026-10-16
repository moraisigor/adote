import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { isNil } from 'lodash'

import type { Session } from '@/type/token'

import type { OrganizationRole } from '@/module/organization/type/organization.role'
import { PermissionProvider } from '@/module/permission/provider'

@Injectable()
export class OrganizationPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permission: PermissionProvider
  ) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.getAllAndOverride<OrganizationRole[]>('organization_permission', [
      context.getClass(),
      context.getHandler()
    ])

    if (isNil(permission)) {
      return true
    }

    const {
      user: {
        user: { id: user }
      },
      params: { id: organization }
    } = context.switchToHttp().getRequest<{
      user: Session
      params: { id: string }
    }>()

    return await this.permission.organization.run(user, organization, permission)
  }
}
