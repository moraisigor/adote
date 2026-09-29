import type { Contact, UserDocument } from './repository/user.schema'

import type { LocationDocument } from '../location/repository/location.schema'

class ContactResponse {
  readonly mail?: string
  readonly phone?: string
  readonly social?: string

  constructor(contact: Contact) {
    this.mail = contact.mail
    this.phone = contact.phone
    this.social = contact.social
  }
}

class LocationResponse {
  readonly id: string
  readonly city: string
  readonly state: string

  constructor(location: LocationDocument) {
    this.id = location.id
    this.city = location.city
    this.state = location.state
  }
}

export class UserResponse {
  readonly id: string
  readonly phone: string
  readonly name?: string
  readonly image?: string
  readonly contact?: ContactResponse
  readonly location?: LocationResponse

  constructor(user: UserDocument) {
    const { contact, location } = user

    this.id = user.id
    this.phone = user.phone
    this.name = user.name
    this.image = user.image

    if (contact) {
      this.contact = new ContactResponse(contact)
    }

    if (location) {
      this.location = new LocationResponse(location)
    }
  }
}

export class UserCurrentResponse extends UserResponse {
  readonly key: string

  constructor(user: UserDocument) {
    super(user)

    this.key = user.key
  }
}

export class RemoveUserResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
