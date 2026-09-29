import { Injectable } from '@nestjs/common'

import { ListBreedProvider } from './list.breed.provider'

@Injectable()
export class BreedProvider {
  constructor(readonly list: ListBreedProvider) {}
}
