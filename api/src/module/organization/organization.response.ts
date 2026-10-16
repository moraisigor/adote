import { ContactResponse } from '@/module/contact/contact.response'

import { url } from '@/helper/image'

import type { OrganizationDocument } from './repository/organization.schema'

export class OrganizationResponse {
  readonly id: string
  readonly name: string
  readonly image?: string
  readonly document?: string
  readonly contact?: ContactResponse

  constructor(organization: OrganizationDocument) {
    const { contact } = organization

    this.id = organization.id
    this.name = organization.name
    this.image = url(organization.image)
    this.document = organization.document

    if (contact) {
      this.contact = new ContactResponse(contact)
    }
  }
}

export class RemoveOrganizationResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
