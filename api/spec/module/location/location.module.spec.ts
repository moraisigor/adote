import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { LocationResponse } from '@/module/location/location.response'

import { Spec } from '../spec'

describe('location module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.location()
  })

  // get /location
  describe('/location', () => {
    // /location?search=recife
    test('should search location', async () => {
      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/location')
        .query({ search: 'recife' })
        .end()

      const response = json<LocationResponse[]>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toHaveLength(1)

      expect(response).toMatchObject([
        {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      ])
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
