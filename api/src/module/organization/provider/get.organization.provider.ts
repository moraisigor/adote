import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class GetOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(id: string): Promise<OrganizationResponse> {
    const organization = await this.repository.find({ _id: id })

    if (isNil(organization)) {
      throw new NotFoundException()
    }

    return new OrganizationResponse(organization)
  }
}
