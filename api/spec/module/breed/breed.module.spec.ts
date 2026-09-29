import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind'

import { Spec } from '../spec'

describe('breed module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.breed()
  })

  // get /breed
  describe('/breed', () => {
    // /breed?kind=cat
    test('should list breed with kind cat', async () => {
      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/breed')
        .query({ kind: Kind.CAT })
        .end()

      const response = json<BreedResponse[]>()

      const breed = response.find((e) => e.name === 'Sem Raça Definida')

      expect(status).toBe(HttpStatus.OK)

      expect(response).toHaveLength(25)

      expect(breed).toMatchObject({
        id: expect.any(String),
        name: 'Sem Raça Definida'
      })
    })

    // /breed?kind=dog
    test('should list breed with kind dog', async () => {
      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/breed')
        .query({ kind: Kind.DOG })
        .end()

      const response = json<BreedResponse[]>()

      const breed = response.find((e) => e.name === 'Buldogue Inglês')

      expect(status).toBe(HttpStatus.OK)

      expect(response).toHaveLength(42)

      expect(breed).toMatchObject({
        id: expect.any(String),
        name: 'Buldogue Inglês'
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
