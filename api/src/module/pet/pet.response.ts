import type { PetView } from './repository/pet.schema'
import type { Gender } from './type/gender'
import type { Size } from './type/size'

import type { Kind } from '../breed/type/kind'

class BreedResponse {
  readonly id: string
  readonly name: string

  constructor(breed: PetView['breed']) {
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

  constructor(pet: PetView) {
    const { breed } = pet

    this.id = pet.id
    this.name = pet.name
    this.kind = pet.kind
    this.size = pet.size
    this.gender = pet.gender
    this.breed = new BreedResponse(breed)
  }
}

export class RemovePetResponse {
  readonly id: string

  constructor(id: string) {
    this.id = id
  }
}
