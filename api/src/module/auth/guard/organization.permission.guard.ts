import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { intersection, isNil } from 'lodash'
import { Types } from 'mongoose'

import type { OrganizationRepository } from '@/module/organization/repository/organization.repository'
import type { OrganizationRole } from '@/module/organization/type/organization.role'

@Injectable()
export class OrganizationPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly repository: OrganizationRepository
  ) {}

  async canActivate(context: ExecutionContext) {
    const values = this.reflector.getAllAndOverride<OrganizationRole[]>('organization_permission', [
      context.getClass(),
      context.getHandler()
    ])

    if (isNil(values)) {
      return true
    }

    const {
      user: { id: user },
      params: { organization: id }
    } = context.switchToHttp().getRequest()

    const organization = await this.repository.find({
      '_id': id,
      'member.user': new Types.ObjectId(user as string)
    })

    const member = organization?.member.find((e) => e.user === user)

    if (isNil(member)) {
      return false
    }

    const { role } = member

    const permission = intersection(role, values)

    return permission.length >= 1
  }
}
