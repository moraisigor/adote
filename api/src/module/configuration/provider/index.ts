import { Injectable } from '@nestjs/common'

import { SetBreedProvider } from './set.breed.provider'
import { SetLocationProvider } from './set.location.provider'
import { SetManagerProvider } from './set.manager.provider'

@Injectable()
export class ConfigurationProvider {
  constructor(
    readonly breed: SetBreedProvider,
    readonly location: SetLocationProvider,
    readonly manager: SetManagerProvider
  ) {}
}
