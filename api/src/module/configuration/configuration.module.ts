import { Module } from '@nestjs/common'

import { BreedModule } from '@/module/breed/breed.module'
import { LocationModule } from '@/module/location/location.module'
import { UserModule } from '@/module/user/user.module'

import { ConfigurationProvider } from './provider'
import { SetBreedProvider } from './provider/set.breed.provider'
import { SetLocationProvider } from './provider/set.location.provider'
import { SetManagerProvider } from './provider/set.manager.provider'

@Module({
  imports: [BreedModule, LocationModule, UserModule],
  exports: [ConfigurationProvider],
  providers: [ConfigurationProvider, SetBreedProvider, SetLocationProvider, SetManagerProvider]
})
export class ConfigurationModule {}
