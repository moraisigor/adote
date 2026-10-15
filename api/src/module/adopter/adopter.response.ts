import type { AdopterView } from './repository/adopter.schema'

class PetResponse {
  readonly id: string
  readonly name: string

  constructor(pet: NonNullable<AdopterView['pet']>) {
    this.id = pet.id
    this.name = pet.name
  }
}

export class AdopterResponse {
  readonly id: string
  readonly name: string
  readonly phone: string
  readonly pet: PetResponse

  constructor(adopter: AdopterView) {
    const { pet } = adopter

    this.id = adopter.id
    this.name = adopter.name
    this.phone = adopter.phone
    this.pet = new PetResponse(pet)
  }
}
