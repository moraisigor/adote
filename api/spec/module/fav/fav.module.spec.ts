import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { Types } from 'mongoose'

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
        .cookies({ token: hash })
        .end()

      const response = json<FavResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: post
      })
    })

    test('should not add unknown fav', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const id = new Types.ObjectId().toHexString()

      const { statusCode: status } = await spec.application
        .inject()
        .post(`/user/fav/${id}`)
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.NOT_FOUND)
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
        .cookies({ token: hash })
        .end()

      const response = json<FavResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: post
      })
    })

    test('should not remove unknown fav', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const id = new Types.ObjectId().toHexString()

      const { statusCode: status } = await spec.application
        .inject()
        .delete(`/user/fav/${id}`)
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
