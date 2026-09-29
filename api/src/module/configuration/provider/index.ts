import { Injectable } from '@nestjs/common'

import { SetBreedProvider } from './set.breed.provider'
import { SetLocationProvider } from './set.location.provider'
import { SetUserProvider } from './set.user.provider'

@Injectable()
export class ConfigurationProvider {
  constructor(
    readonly user: SetUserProvider,
    readonly breed: SetBreedProvider,
    readonly location: SetLocationProvider
  ) {}
}
