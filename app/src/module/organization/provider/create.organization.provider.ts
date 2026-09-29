import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { CreateOrganizationRequest } from '../organization.request'
import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'
import { OrganizationRole } from '../type/organization.role'

@Injectable()
export class CreateOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(request: CreateOrganizationRequest, current: string): Promise<OrganizationResponse> {
    const { name } = request

    const organization = await this.repository.create({
      name,
      member: [
        {
          user: new Types.ObjectId(current),
          role: OrganizationRole.MANAGER
        }
      ]
    })

    return new OrganizationResponse(organization)
  }
}
