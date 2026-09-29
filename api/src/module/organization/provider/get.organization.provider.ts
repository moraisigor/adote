import { Injectable, NotFoundException } from '@nestjs/common'

import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class GetOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(id: string): Promise<OrganizationResponse> {
    const organization = await this.repository.find({ _id: id })

    if (organization) {
      return new OrganizationResponse(organization)
    }

    throw new NotFoundException()
  }
}
