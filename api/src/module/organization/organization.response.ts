import type { Contact, OrganizationDocument } from './repository/organization.schema'

export class ContactResponse {
  readonly mail?: string
  readonly phone?: string
  readonly social?: string

  constructor(contact: Contact) {
    this.mail = contact.mail
    this.phone = contact.phone
    this.social = contact.social
  }
}

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
    this.image = organization.image
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
