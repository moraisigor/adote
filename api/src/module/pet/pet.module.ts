import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BreedModule } from '@/module/breed/breed.module'
import { ImageModule } from '@/module/image/image.module'
import { PermissionModule } from '@/module/permission/permission.module'

import { RemovePetListener } from './listener/remove.pet.listener'
import { PetController } from './pet.controller'
import { PetProvider } from './provider'
import { CreatePetProvider } from './provider/create.pet.provider'
import { GetPetProvider } from './provider/get.pet.provider'
import { ListPetProvider } from './provider/list.pet.provider'
import { RemovePetProvider } from './provider/remove.pet.provider'
import { SaveImagePetProvider } from './provider/save.image.pet.provider'
import { SavePetProvider } from './provider/save.pet.provider'
import { SaveStatePetProvider } from './provider/save.state.pet.provider'
import { PetRepository } from './repository/pet.repository'
import { Pet, PetSchema } from './repository/pet.schema'

@Module({
  imports: [
    BreedModule,
    ImageModule,
    PermissionModule,
    // dependency
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])
  ],
  exports: [PetRepository],
  providers: [
    CreatePetProvider,
    GetPetProvider,
    ListPetProvider,
    PetProvider,
    PetRepository,
    RemovePetListener,
    RemovePetProvider,
    SaveImagePetProvider,
    SavePetProvider,
    SaveStatePetProvider
  ],
  controllers: [PetController]
})
export class PetModule {}
