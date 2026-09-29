import { BadRequestException, Injectable } from '@nestjs/common'

import { RemoveOrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class RemoveOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(id: string): Promise<RemoveOrganizationResponse> {
    const result = await this.repository.remove({ _id: id })

    if (result) {
      return new RemoveOrganizationResponse(id)
    }

    throw new BadRequestException()
  }
}
