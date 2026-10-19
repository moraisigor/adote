import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { AdopterResponse } from '@/module/adopter/adopter.response'

import { Spec } from '../spec'

describe('adopter module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.adopter()
  })

  // get /adopter
  describe('/adopter', () => {
    test('should list adopter', async () => {
      const { hash } = spec.scenario

      await spec.scenario.build.adopter.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/adopter')
        .query({ page: '1', amount: '10' })
        .cookies({ token: hash })
        .end()

      const response = json<AdopterResponse[]>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toContainEqual({
        id: expect.any(String),
        name: 'Name',
        phone: '+5511999999999',
        pet: {
          id: expect.any(String),
          name: 'Oreo'
        }
      })
    })

    test('should list adopter with organization', async () => {
      const { hash } = spec.scenario

      const { id: organization } = await spec.scenario.build.organization.create()

      await spec.scenario.build.adopter.create('Oreo', organization)

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/adopter')
        .query({ page: '1', amount: '10', organization })
        .cookies({ token: hash })
        .end()

      const response = json<AdopterResponse[]>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toContainEqual({
        id: expect.any(String),
        name: 'Name',
        phone: '+5511999999999',
        pet: {
          id: expect.any(String),
          name: 'Oreo'
        }
      })
    })

    test('should not list adopter organization without permission', async () => {
      const { token: { hash } = { hash: '' } } = await spec.scenario.session('+5511999999999')

      const { id: organization } = await spec.scenario.build.organization.create()

      const { statusCode: status } = await spec.application
        .inject()
        .get('/adopter')
        .query({ page: '1', amount: '10', organization })
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  // post /adopter
  describe('/adopter', () => {
    test('should create adopter', async () => {
      const {
        pet: { id: pet }
      } = await spec.scenario.build.post.create()

      const { statusCode: status } = await spec.application
        .inject()
        .post('/adopter')
        .body({
          name: 'Name',
          phone: '+5511999999999',
          pet: pet
        })
        .end()

      expect(status).toBe(HttpStatus.NO_CONTENT)
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
