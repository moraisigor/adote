import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { OrganizationResponse } from '@/module/organization/organization.response'
import { OrganizationRepository } from '@/module/organization/repository/organization.repository'

@Injectable()
export class ListOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(user: string): Promise<OrganizationResponse[]> {
    const list = await this.repository.list({
      'member.user': new Types.ObjectId(user)
    })

    return list.map((e) => new OrganizationResponse(e))
  }
}
