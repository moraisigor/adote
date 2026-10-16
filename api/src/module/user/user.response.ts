import { ContactResponse } from '@/module/contact/contact.response'
import { LocationResponse } from '@/module/location/location.response'

import { url } from '@/helper/image'

import type { UserView } from './repository/user.schema'

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
