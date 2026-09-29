import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { isNil } from 'lodash'

import type { Role } from '@/module/user/type/role'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.getAllAndOverride<Role[]>('permission', [
      context.getClass(),
      context.getHandler()
    ])

    if (isNil(permission)) {
      return true
    }

    const {
      user: { role }
    } = context.switchToHttp().getRequest()

    return permission.includes(role)
  }
}
