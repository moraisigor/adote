import { Injectable } from '@nestjs/common'

import { CreatePetProvider } from './create.pet.provider'
import { GetPetProvider } from './get.pet.provider'
import { ListPetProvider } from './list.pet.provider'
import { RemovePetProvider } from './remove.pet.provider'
import { SavePetProvider } from './save.pet.provider'

@Injectable()
export class PetProvider {
  constructor(
    readonly get: GetPetProvider,
    readonly list: ListPetProvider,
    readonly create: CreatePetProvider,
    readonly save: SavePetProvider,
    readonly remove: RemovePetProvider
  ) {}
}
