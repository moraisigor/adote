import { Injectable } from '@nestjs/common'

import { SearchLocationProvider } from './search.location.provider'

@Injectable()
export class LocationProvider {
  constructor(readonly search: SearchLocationProvider) {}
}
