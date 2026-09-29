import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { FavResponse } from '@/module/fav/fav.response'

import { Spec } from '../spec'

describe('fav module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.fav()
  })

  // post /fav/post
  describe('/fav/post', () => {
    test('should add fav', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: post } = await spec.scenario.build.post.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .post(`/user/fav/${post}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<FavResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: post
      })
    })
  })

  // delete /fav/post
  describe('/fav/post', () => {
    test('should remove fav', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: post } = await spec.scenario.build.fav.add()

      const { statusCode: status, json } = await spec.application
        .inject()
        .delete(`/user/fav/${post}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<FavResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: post
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
