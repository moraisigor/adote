import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { OrganizationRepository } from '@/module/organization/repository/organization.repository'
import { OrganizationRole } from '@/module/organization/type/organization.role'

@Injectable()
export class OrganizationPermissionProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(
    current: string,
    organization: string,
    permission: OrganizationRole[] = [OrganizationRole.MEMBER, OrganizationRole.MANAGER]
  ) {
    return await this.repository.exists({
      '_id': organization,
      'member.user': new Types.ObjectId(current),
      'member.role': { $in: permission }
    })
  }
}
