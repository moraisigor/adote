import { BreedResponse } from '@/module/breed/breed.response'

import type { PetView } from './repository/pet.schema'
import type { Gender } from './type/gender'
import type { Size } from './type/size'

import type { Kind } from '../breed/type/kind'

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
