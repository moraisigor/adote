import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { SaveOrganizationRequest } from '../organization.request'
import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class SaveOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(id: string, request: SaveOrganizationRequest): Promise<OrganizationResponse> {
    const { name, document, contact, location } = request

    const map: { [key: string]: unknown } = {
      'name': name,
      'document': document,
      'contact.mail': contact?.mail,
      'contact.phone': contact?.phone,
      'contact.social': contact?.social,
      'location': location && new Types.ObjectId(location)
    }

    const organization = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (isNil(organization)) {
      throw new NotFoundException()
    }

    return new OrganizationResponse(organization)
  }
}
