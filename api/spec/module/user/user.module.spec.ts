import { HttpStatus } from '@nestjs/common/enums'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { OrganizationResponse } from '@/module/organization/organization.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import type { PostResponse } from '@/module/post/post.response'
import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('user module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.user()
  })

  // get /user/current
  describe('/user/current', () => {
    test('should get current user', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      await spec.scenario.build.user.save()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/user/current')
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<UserResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        phone: '+5599999999999',
        name: 'Name',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999',
          social: 'https://example.com/name'
        },
        location: {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      })
    })
  })

  // get /user/post
  describe('/user/post', () => {
    test('should list post', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      await spec.scenario.build.post.create()

      await spec.scenario.build.user.save()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/user/post')
        .query({ page: '1', amount: '10' })
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<PostResponse[]>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toHaveLength(1)

      expect(response).toMatchObject([
        {
          id: expect.any(String),
          image: ['image.jpg'],
          pet: {
            id: expect.any(String),
            name: 'Oreo',
            size: Size.MEDIUM,
            gender: Gender.MALE,
            breed: {
              id: expect.any(String),
              name: 'Buldogue Inglês'
            }
          },
          location: {
            id: expect.any(String),
            city: 'Recife',
            state: 'Pernambuco'
          },
          user: {
            id: expect.any(String),
            name: 'Name',
            contact: {
              mail: 'mail@example.com',
              phone: '+5599999999999',
              social: 'https://example.com/name'
            }
          }
        }
      ])
    })
  })

  // get /user/organization
  describe('/user/organization', () => {
    test('should list organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      await spec.scenario.build.organization.create()

      await spec.scenario.build.organization.save()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/user/organization')
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<OrganizationResponse[]>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toHaveLength(1)

      expect(response).toMatchObject([
        {
          id: expect.any(String),
          name: 'Name',
          contact: {
            mail: 'mail@example.com',
            phone: '+5599999999999',
            social: 'https://example.com/name'
          }
        }
      ])
    })
  })

  // get /user/id
  describe('/user/id', () => {
    test('should get user', async () => {
      const { id } = await spec.scenario.build.user.save()

      const { statusCode: status, json } = await spec.application.inject().get(`/user/${id}`).end()

      const response = json<UserResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        phone: '+5599999999999',
        name: 'Name',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999',
          social: 'https://example.com/name'
        },
        location: {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      })
    })
  })

  // put /user
  describe('/user', () => {
    test('should save user', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const [{ id: location }] = await spec.scenario.build.location.search()

      const { statusCode: status, json } = await spec.application
        .inject()
        .put('/user')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Name',
          contact: {
            mail: 'mail@example.com',
            phone: '+5599999999999',
            social: 'https://example.com/name'
          },
          location: location
        })
        .end()

      const response = json<UserResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        phone: '+5599999999999',
        name: 'Name',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999',
          social: 'https://example.com/name'
        },
        location: {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      })
    })
  })

  // put /user/image
  describe('/user/image', () => {
    test('should save image', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      await spec.scenario.build.user.save()

      const { statusCode: status, json } = await spec.application
        .inject()
        .put('/user/image')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          image: 'image.jpg'
        })
        .end()

      const response = json<UserResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        phone: '+5599999999999',
        name: 'Name',
        image: 'image.jpg',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999',
          social: 'https://example.com/name'
        },
        location: {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})

describe('user module', () => {
  describe('as manager', async () => {
    const spec = await Spec.build()

    beforeAll(async () => {
      await spec.start()

      await spec.scenario.manager()
    })

    // get /user
    describe('/user', () => {
      test('should list user', async () => {
        const {
          authorization: { token: { hash } = { hash: '' } }
        } = spec.scenario

        const { statusCode: status, json } = await spec.application
          .inject()
          .get('/user')
          .headers({ Authorization: `Bearer ${hash}` })
          .end()

        const response = json<UserResponse[]>()

        expect(status).toBe(HttpStatus.OK)

        expect(response).toHaveLength(1)

        expect(response).toMatchObject([
          {
            id: expect.any(String),
            phone: '+5599999999999',
            name: 'Name',
            contact: {
              mail: 'mail@example.com',
              phone: '+5599999999999',
              social: 'https://example.com/name'
            },
            location: {
              id: expect.any(String),
              city: 'Recife',
              state: 'Pernambuco'
            }
          }
        ])
      })
    })

    afterAll(async () => {
      await spec.stop()
    })
  })
})
