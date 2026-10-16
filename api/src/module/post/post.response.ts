import { BreedResponse } from '@/module/breed/breed.response'
import { ContactResponse } from '@/module/contact/contact.response'
import { LocationResponse } from '@/module/location/location.response'
import type { Gender } from '@/module/pet/type/gender'
import type { Size } from '@/module/pet/type/size'

import { url } from '@/helper/image'

import type { PostView } from './repository/post.schema'

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

class UserResponse {
  readonly id: string
  readonly name?: string
  readonly image?: string
  readonly contact?: ContactResponse

  constructor(user: NonNullable<PostView['user']>) {
    const { contact } = user

    this.id = user.id
    this.name = user.name
    this.image = url(user.image)

    if (contact) {
      this.contact = new ContactResponse(contact)
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
    this.image = url(organization.image)

    if (contact) {
      this.contact = new ContactResponse(contact)
    }
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
    this.image = post.image.map((e) => url(e) ?? e)
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
