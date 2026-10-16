import type { Contact } from './contact.schema'

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
