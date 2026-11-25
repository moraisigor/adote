import { ContactResponse } from '@/module/contact/contact.response'
import { LocationResponse } from '@/module/location/location.response'

import { url } from '@/helper/image'

import type { OrganizationView } from './repository/organization.schema'

export class OrganizationResponse {
  readonly id: string
  readonly name: string
  readonly image?: string
  readonly document?: string
  readonly contact?: ContactResponse
  readonly location?: LocationResponse

  constructor(organization: OrganizationView) {
    const { contact, location } = organization

    this.id = organization.id
    this.name = organization.name
    this.image = url(organization.image)
    this.document = organization.document

    if (contact) {
      this.contact = new ContactResponse(contact)
    }

    if (location) {
      this.location = new LocationResponse(location)
    }
  }
}

export class RemoveOrganizationResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
