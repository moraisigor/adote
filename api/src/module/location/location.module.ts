import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { LocationController } from './location.controller'
import { LocationProvider } from './provider'
import { SearchLocationProvider } from './provider/search.location.provider'
import { LocationRepository } from './repository/location.repository'
import { Location, LocationSchema } from './repository/location.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }])],
  exports: [LocationRepository],
  providers: [LocationProvider, SearchLocationProvider, LocationRepository],
  controllers: [LocationController]
})
export class LocationModule {}
