import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { ImageResponse } from '@/module/image/image.response'
import { ImageKind } from '@/module/image/type/image'

import { Spec } from '../spec'

describe('image module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.user()
  })

  // post /image
  describe('/image', () => {
    test.each([ImageKind.POST, ImageKind.USER])('should save %s image', async (kind) => {
      const { hash } = spec.scenario

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/api/image')
        .cookies({ token: hash })
        .body({
          kind,
          size: 1024,
          extension: 'image/webp'
        })
        .end()

      const { key, url } = json<ImageResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(key).toMatch(new RegExp(`^${kind}/[\\w-]{24}\\.webp$`))

      expect(url).toContain(`/${key}?`)
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
