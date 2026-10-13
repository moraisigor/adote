import { url } from '@/helper/image'

import type { Contact, UserView } from './repository/user.schema'

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

  constructor(location: NonNullable<UserView['location']>) {
    this.id = location.id
    this.city = location.city
    this.state = location.state
  }
}

export class UserResponse {
  readonly id: string
  readonly name?: string
  readonly image?: string
  readonly contact?: ContactResponse
  readonly location?: LocationResponse

  constructor(user: UserView) {
    const { contact, location } = user

    this.id = user.id
    this.name = user.name
    this.image = url(user.image)

    if (contact) {
      this.contact = new ContactResponse(contact)
    }

    if (location) {
      this.location = new LocationResponse(location)
    }
  }
}

export class CurrentUserResponse extends UserResponse {
  readonly phone: string

  constructor(user: UserView) {
    super(user)

    this.phone = user.phone
  }
}

export class RemoveUserResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
