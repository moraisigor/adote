import { ForbiddenException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { OrganizationPermissionProvider } from './organization.permission.provider'

import type { Scope } from '../type/scope'

@Injectable()
export class ScopePermissionProvider {
  constructor(private readonly organization: OrganizationPermissionProvider) {}

  async run(current: string, organization?: string): Promise<Scope> {
    if (isNil(organization)) {
      return { user: new Types.ObjectId(current) }
    }

    const permission = await this.organization.run(current, organization)

    if (!permission) {
      throw new ForbiddenException()
    }

    return { organization: new Types.ObjectId(organization) }
  }
}
