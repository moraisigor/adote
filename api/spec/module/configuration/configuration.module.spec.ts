import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { BreedResponse } from '@/module/breed/breed.response'
import type { LocationResponse } from '@/module/location/location.response'
import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('configuration module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // post /configuration/breed
  describe('/configuration/breed', () => {
    test('should load breed list', async () => {
      const { BASIC_AUTHORIZATION } = spec.scenario

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/configuration/breed')
        .headers({ Authorization: `Basic ${BASIC_AUTHORIZATION}` })
        .end()

      const response = json<BreedResponse[]>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toHaveLength(67)
    })
  })

  // post /configuration/location
  describe('/configuration/location', () => {
    test('should load location list', async () => {
      const { BASIC_AUTHORIZATION } = spec.scenario

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/configuration/location')
        .headers({ Authorization: `Basic ${BASIC_AUTHORIZATION}` })
        .end()

      const response = json<LocationResponse[]>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toHaveLength(5694)
    })
  })

  // post /configuration/user
  describe('/configuration/user', () => {
    test('should load user', async () => {
      const { BASIC_AUTHORIZATION } = spec.scenario

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/configuration/user')
        .headers({ Authorization: `Basic ${BASIC_AUTHORIZATION}` })
        .end()

      const response = json<UserResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Dev',
        phone: '+5599999999999'
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
