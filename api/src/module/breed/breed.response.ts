import type { BreedDocument } from './repository/breed.schema'

export class BreedResponse {
  readonly id: string
  readonly name: string

  constructor(breed: Pick<BreedDocument, 'id' | 'name'>) {
    this.id = breed.id
    this.name = breed.name
  }
}
