import type { PostView } from './repository/post.schema'

import type { Gender } from '../pet/type/gender'
import type { Size } from '../pet/type/size'

class BreedResponse {
  readonly id: string
  readonly name: string

  constructor(breed: PostView['pet']['breed']) {
    this.id = breed.id
    this.name = breed.name
  }
}

export class PetResponse {
  readonly id: string
  readonly name: string
  readonly size: Size
  readonly gender: Gender
  readonly breed: BreedResponse

  constructor(pet: PostView['pet']) {
    const { breed } = pet

    this.id = pet.id
    this.name = pet.name
    this.size = pet.size
    this.gender = pet.gender
    this.breed = new BreedResponse(breed)
  }
}

class LocationResponse {
  readonly id: string
  readonly city: string
  readonly state: string

  constructor(location: PostView['location']) {
    this.id = location.id
    this.city = location.city
    this.state = location.state
  }
}

class UserResponse {
  readonly id: string
  readonly name?: string
  readonly image?: string
  readonly contact?: ContactResponse

  constructor(user: NonNullable<PostView['user']>) {
    const { contact } = user

    this.id = user.id
    this.name = user.name
    this.image = user.image

    if (contact) {
      const { mail, phone, social } = contact

      this.contact = new ContactResponse(mail, phone, social)
    }
  }
}

class OrganizationResponse {
  readonly id: string
  readonly name: string
  readonly image?: string
  readonly contact?: ContactResponse

  constructor(organization: NonNullable<PostView['organization']>) {
    const { contact } = organization

    this.id = organization.id
    this.name = organization.name
    this.image = organization.image

    if (contact) {
      const { mail, phone, social } = contact

      this.contact = new ContactResponse(mail, phone, social)
    }
  }
}

class ContactResponse {
  readonly mail?: string
  readonly phone?: string
  readonly social?: string

  constructor(mail?: string, phone?: string, social?: string) {
    this.mail = mail
    this.phone = phone
    this.social = social
  }
}

export class PostResponse {
  readonly id: string
  readonly image: string[]
  readonly pet: PetResponse
  readonly location: LocationResponse
  readonly user?: UserResponse
  readonly organization?: OrganizationResponse

  constructor(post: PostView) {
    const { pet, location, user, organization } = post

    this.id = post.id
    this.image = post.image
    this.pet = new PetResponse(pet)
    this.location = new LocationResponse(location)

    if (user) {
      this.user = new UserResponse(user)
    }

    if (organization) {
      this.organization = new OrganizationResponse(organization)
    }
  }
}

export class PublishPostResponse {
  readonly id: string
  readonly publish: boolean

  constructor(post: PostView) {
    this.id = post.id
    this.publish = post.publish
  }
}

export class RemovePostResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
