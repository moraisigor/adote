import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { AdopterResponse } from '@/module/adopter/adopter.response'

import { Spec } from '../spec'

describe('adopter module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.post()
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
