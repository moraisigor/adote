import { Injectable } from '@nestjs/common'

import { BreedResponse } from '@/module/breed/breed.response'
import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { Kind } from '@/module/breed/type/kind'

import cat from '../cat.json'
import dog from '../dog.json'

@Injectable()
export class SetBreedProvider {
  constructor(private readonly repository: BreedRepository) {}

  async run(): Promise<BreedResponse[]> {
    await this.repository.remove()

    const list = await Promise.all([
      this.repository.create(
        cat.map((name) => {
          return {
            name,
            kind: Kind.CAT
          }
        })
      ),
      this.repository.create(
        dog.map((name) => {
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
