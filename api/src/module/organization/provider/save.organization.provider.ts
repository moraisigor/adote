import { BadRequestException, Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { SaveOrganizationRequest } from '../organization.request'
import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class SaveOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(id: string, request: SaveOrganizationRequest): Promise<OrganizationResponse> {
    const { name, document, contact } = request

    const map: { [key: string]: unknown } = {
      'name': name,
      'document': document,
      'contact.mail': contact?.mail,
      'contact.phone': contact?.phone,
      'contact.social': contact?.social
    }

    const organization = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (organization) {
      return new OrganizationResponse(organization)
    }

    throw new BadRequestException()
  }
}
