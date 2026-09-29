import { Injectable } from '@nestjs/common'

import { BreedResponse } from '../breed.response'
import { BreedRepository } from '../repository/breed.repository'
import type { Kind } from '../type/kind'

@Injectable()
export class ListBreedProvider {
  constructor(private readonly repository: BreedRepository) {}

  async run(kind: Kind): Promise<BreedResponse[]> {
    const list = await this.repository.list({ kind })

    return list.map((e) => new BreedResponse(e))
  }
}
