import { Injectable } from '@nestjs/common'

import { BreedResponse } from '@/module/breed/breed.response'
import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { Kind } from '@/module/breed/type/kind'

import CAT from '../cat.json'
import DOG from '../dog.json'

@Injectable()
export class SetBreedProvider {
  constructor(private readonly repository: BreedRepository) {}

  async run(): Promise<BreedResponse[]> {
    await this.repository.remove()

    const list = await Promise.all([
      this.repository.create(
        CAT.map((name) => {
          return {
            name,
            kind: Kind.CAT
          }
        })
      ),
      this.repository.create(
        DOG.map((name) => {
          return {
            name,
            kind: Kind.DOG
          }
        })
      )
    ])

    return list.flat().map((e) => new BreedResponse(e))
  }
}
