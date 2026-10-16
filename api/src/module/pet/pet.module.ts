import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PetController } from './pet.controller'
import { PetProvider } from './provider'
import { CreatePetProvider } from './provider/create.pet.provider'
import { GetPetProvider } from './provider/get.pet.provider'
import { ListPetProvider } from './provider/list.pet.provider'
import { RemovePetProvider } from './provider/remove.pet.provider'
import { SavePetProvider } from './provider/save.pet.provider'
import { PetRepository } from './repository/pet.repository'
import { Pet, PetSchema } from './repository/pet.schema'

import { AdopterModule } from '../adopter/adopter.module'
import { PermissionModule } from '../permission/permission.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    PermissionModule,
    forwardRef(() => AdopterModule)
  ],
  exports: [PetRepository],
  providers: [
    PetProvider,
    GetPetProvider,
    ListPetProvider,
    CreatePetProvider,
    SavePetProvider,
    RemovePetProvider,
    PetRepository
  ],
  controllers: [PetController]
})
export class PetModule {}
