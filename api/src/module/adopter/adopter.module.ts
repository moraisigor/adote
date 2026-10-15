import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AdopterController } from './adopter.controller'
import { AdopterProvider } from './provider'
import { CreateAdopterProvider } from './provider/create.adopter.provider'
import { ListAdopterProvider } from './provider/list.adopter.provider'
import { AdopterRepository } from './repository/adopter.repository'
import { Adopter, AdopterSchema } from './repository/adopter.schema'

import { PermissionModule } from '../permission/permission.module'
import { PetModule } from '../pet/pet.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Adopter.name, schema: AdopterSchema }]),
    PermissionModule,
    PetModule
  ],
  providers: [AdopterProvider, ListAdopterProvider, CreateAdopterProvider, AdopterRepository],
  controllers: [AdopterController]
})
export class AdopterModule {}
