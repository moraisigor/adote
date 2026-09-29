import type { PostDocument } from './repository/post.schema'

import type { BreedDocument } from '../breed/repository/breed.schema'
import type { LocationDocument } from '../location/repository/location.schema'
import type { OrganizationDocument } from '../organization/repository/organization.schema'
import type { PetDocument } from '../pet/repository/pet.schema'
import type { Gender } from '../pet/type/gender'
import type { Size } from '../pet/type/size'
import type { UserDocument } from '../user/repository/user.schema'

class BreedResponse {
  readonly id: string
  readonly name: string

  constructor(breed: BreedDocument) {
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

  constructor(pet: PetDocument) {
    const { breed } = pet

    this.id = pet.id
    this.name = pet.name
    this.size = pet.size
    this.gender = pet.gender
    this.breed = new BreedResponse(breed as BreedDocument)
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

class UserResponse {
  readonly id: string
  readonly name?: string
  readonly image?: string
  readonly contact?: ContactResponse

  constructor(user: UserDocument) {
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

  constructor(organization: OrganizationDocument) {
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

  constructor(post: PostDocument) {
    const { pet, location, user, organization } = post

    this.id = post.id
    this.image = post.image
    this.pet = new PetResponse(pet as PetDocument)
    this.location = new LocationResponse(location as LocationDocument)

    if (user) {
      this.user = new UserResponse(user as UserDocument)
    }

    if (organization) {
      this.organization = new OrganizationResponse(organization as OrganizationDocument)
    }
  }
}

export class PublishPostResponse {
  readonly id: string
  readonly publish: boolean

  constructor(post: PostDocument) {
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
