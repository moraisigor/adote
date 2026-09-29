import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { Spec } from '../spec'

describe('health module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // get /health
  describe('/health', () => {
    test('should verify health', async () => {
      const { statusCode: status, json } = await spec.application.inject().get('/health').end()

      const response = json<{ state: boolean }>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        state: true
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
