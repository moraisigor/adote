import { Injectable } from '@nestjs/common'

import { ListOrganizationRequest } from '../organization.request'
import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class ListOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(request: ListOrganizationRequest): Promise<OrganizationResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount)

    return list.map((e) => new OrganizationResponse(e))
  }
}
