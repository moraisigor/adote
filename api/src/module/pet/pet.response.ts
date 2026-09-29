// import type { BreedDocument } from '@/module/breed/repository/breed.schema'

import type { PetDocument } from './repository/pet.schema'
import type { Gender } from './type/gender'
import type { Size } from './type/size'

import type { BreedDocument } from '../breed/repository/breed.schema'
import type { Kind } from '../breed/type/kind'

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
  readonly kind: Kind
  readonly size: Size
  readonly gender: Gender
  readonly breed: BreedResponse

  constructor(pet: PetDocument) {
    this.id = pet.id
    this.name = pet.name
    this.kind = pet.kind
    this.size = pet.size
    this.gender = pet.gender
    this.breed = new BreedResponse(pet.breed as BreedDocument)
  }
}

export class RemovePetResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
