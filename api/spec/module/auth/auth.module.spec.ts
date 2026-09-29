import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { TokenResponse, type AuthResponse } from '@/module/auth/auth.response'

import { Spec } from '../spec'

describe('auth module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // post /auth
  describe('/auth', () => {
    test('should start auth', async () => {
      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/auth')
        .body({
          phone: '+5599999999999'
        })
        .end()

      const response = json<AuthResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        phone: '+5599999999999'
      })
    })
  })

  // post /auth/key
  describe('/auth/key', () => {
    beforeAll(async () => {
      await spec.scenario.authenticate()
    })

    test('should auth user with key', async () => {
      const { key } = await spec.scenario.build.user.current()

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/auth/key')
        .headers({ Key: key })
        .end()

      const response = json<TokenResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        token: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_EXPIRE)
        },
        renew: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_RENEW_EXPIRE)
        }
      })
    })
  })

  // post /auth/verify
  describe('/auth/verify', () => {
    test('should auth user with code', async () => {
      const { phone } = await spec.scenario.build.auth.auth()

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/auth/verify')
        .body({
          phone,
          code: '999999'
        })
        .end()

      const response = json<TokenResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        token: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_EXPIRE)
        },
        renew: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_RENEW_EXPIRE)
        }
      })
    })
  })

  // post /auth/renew
  describe('/auth/renew', () => {
    beforeAll(async () => {
      await spec.scenario.authenticate()
    })

    test('should renew auth', async () => {
      const {
        authorization: { renew: { hash } = { hash: '' } }
      } = spec.scenario

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/auth/renew')
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<TokenResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        token: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_EXPIRE)
        },
        renew: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_RENEW_EXPIRE)
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
