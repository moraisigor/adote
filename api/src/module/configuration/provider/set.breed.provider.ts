import { Injectable, Logger } from '@nestjs/common'

import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { Kind } from '@/module/breed/type/kind'

import CAT from '../cat.json'
import DOG from '../dog.json'

@Injectable()
export class SetBreedProvider {
  private readonly logger = new Logger(SetBreedProvider.name)

  constructor(private readonly repository: BreedRepository) {}

  async run() {
    const {
      insertedCount: insert,
      upsertedCount: upsert,
      deletedCount: remove
    } = await this.repository.create([
      ...CAT.map((name) => ({ name, kind: Kind.CAT })),
      ...DOG.map((name) => ({ name, kind: Kind.DOG }))
    ])

    this.logger.log(`insert: ${insert}, upsert: ${upsert}, remove: ${remove}`)
  }
}
