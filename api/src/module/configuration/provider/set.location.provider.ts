import { Injectable } from '@nestjs/common'

import { LocationResponse } from '@/module/location/location.response'
import { LocationRepository } from '@/module/location/repository/location.repository'

import location from '../location.json'

@Injectable()
export class SetLocationProvider {
  constructor(private readonly repository: LocationRepository) {}

  async run(): Promise<LocationResponse[]> {
    await this.repository.remove()

    const result = await this.repository.create(location)

    return result.map((e) => new LocationResponse(e))
  }
}
