import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BreedController } from './breed.controller'
import { BreedProvider } from './provider'
import { ListBreedProvider } from './provider/list.breed.provider'
import { BreedRepository } from './repository/breed.repository'
import { Breed, BreedSchema } from './repository/breed.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Breed.name, schema: BreedSchema }])],
  exports: [BreedRepository],
  providers: [BreedProvider, ListBreedProvider, BreedRepository],
  controllers: [BreedController]
})
export class BreedModule {}
