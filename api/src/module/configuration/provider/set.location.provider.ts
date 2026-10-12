import { Injectable, Logger } from '@nestjs/common'

import { LocationRepository } from '@/module/location/repository/location.repository'

import { normalize } from '@/helper/string'

import LOCATION from '../location.json'

@Injectable()
export class SetLocationProvider {
  private readonly logger = new Logger(SetLocationProvider.name)

  constructor(private readonly repository: LocationRepository) {}

  async run() {
    const {
      insertedCount: insert,
      upsertedCount: upsert,
      deletedCount: remove
    } = await this.repository.create(
      LOCATION.map((e) => ({
        city: e.city,
        state: e.state,
        search: normalize(e.city)
      }))
    )

    this.logger.log(`insert: ${insert}, upsert: ${upsert}, remove: ${remove}`)
  }
}
