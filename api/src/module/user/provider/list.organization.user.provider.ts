import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { OrganizationResponse } from '@/module/organization/organization.response'
import { OrganizationRepository } from '@/module/organization/repository/organization.repository'

import { ListOrganizationUserRequest } from '../user.request'

@Injectable()
export class ListOrganizationUserProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(request: ListOrganizationUserRequest, current: string): Promise<OrganizationResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, {
      'member.user': new Types.ObjectId(current)
    })

    return list.map((e) => new OrganizationResponse(e))
  }
}
