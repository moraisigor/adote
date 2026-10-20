import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { Spec } from '../spec'

describe('auth module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // post /auth
  describe('/auth', () => {
    test('should start auth', async () => {
      const { statusCode: status } = await spec.application
        .inject()
        .post('/api/auth')
        .body({
          phone: '+5599999999999'
        })
        .end()

      expect(status).toBe(HttpStatus.NO_CONTENT)
    })

    test.each([[{}], ['+5599']])('should not start auth with %p phone', async (phone) => {
      const { statusCode: status } = await spec.application
        .inject()
        .post('/api/auth')
        .body({
          phone
        })
        .end()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })
  })

  // post /auth/verify
  describe('/auth/verify', () => {
    test('should auth user with code', async () => {
      const { phone, code } = await spec.scenario.build.auth.auth()

      const { statusCode: status, cookies } = await spec.application
        .inject()
        .post('/api/auth/verify')
        .body({
          phone,
          code
        })
        .end()

      expect(status).toBe(HttpStatus.NO_CONTENT)

      expect(cookies).toMatchObject([
        {
          name: 'token',
          value: expect.any(String),
          expires: expect.any(Date)
        },
        {
          name: 'renew',
          path: '/api/auth',
          value: expect.any(String),
          expires: expect.any(Date)
        }
      ])
    })

    test.each([[{}], ['+5599']])('should not auth user with %p phone', async (phone) => {
      const { statusCode: status } = await spec.application
        .inject()
        .post('/api/auth/verify')
        .body({
          phone,
          code: '123456'
        })
        .end()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
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

      const { statusCode: status, cookies } = await spec.application
        .inject()
        .post('/api/auth/renew')
        .cookies({ renew: hash })
        .end()

      expect(status).toBe(HttpStatus.NO_CONTENT)

      expect(cookies).toMatchObject([
        {
          name: 'token',
          value: expect.any(String),
          expires: expect.any(Date)
        },
        {
          name: 'renew',
          path: '/api/auth',
          value: expect.any(String),
          expires: expect.any(Date)
        }
      ])
    })
  })

  // post /auth/expire
  describe('/auth/expire', () => {
    test('should expire auth', async () => {
      const { statusCode: status, cookies } = await spec.application.inject().post('/api/auth/expire').end()

      expect(status).toBe(HttpStatus.NO_CONTENT)

      expect(cookies).toMatchObject([
        {
          name: 'token',
          value: '',
          expires: new Date('1970-01-01')
        },
        {
          name: 'renew',
          path: '/api/auth',
          value: '',
          expires: new Date('1970-01-01')
        }
      ])
    })
  })

  // get /user/current
  describe('/user/current', () => {
    test('should not get current user without authentication', async () => {
      const { statusCode: status } = await spec.application.inject().get('/api/user/current').end()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
