import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import type { PostResponse, RemovePostResponse } from '@/module/post/post.response'

import { Spec } from '../spec'

describe('post module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.post()
  })

  // get /post
  describe('/post', () => {
    test('should list post', async () => {
      await spec.scenario.build.post.create()

      const [{ id: location }] = await spec.scenario.build.location.search()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/post')
        .query({ page: '1', amount: '10', location: [location] })
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

    test('should list post with organization', async () => {
      const [{ id: organization }] = await spec.scenario.build.user.organization()

      await spec.scenario.build.post.create('Oreo', organization)

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/post')
        .query({ page: '1', amount: '10', organization: organization })
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
          organization: {
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

  // get /post/id
  describe('/post/id', () => {
    test('should get post', async () => {
      const { id: post } = await spec.scenario.build.post.create()

      const { statusCode: status, json } = await spec.application.inject().get(`/post/${post}`).end()

      const response = json<PostResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: post,
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
      })
    })
  })

  // post /post
  describe('/post', () => {
    test('should create post', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: pet } = await spec.scenario.build.pet.create()
      const [{ id: location }] = await spec.scenario.build.location.search()

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/post')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          image: ['image.jpg'],
          pet: pet,
          location: location,
          publish: true
        })
        .end()

      const response = json<PostResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toMatchObject({
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
      })
    })

    test('should create post with organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const [{ id: location }] = await spec.scenario.build.location.search()
      const [{ id: organization }] = await spec.scenario.build.user.organization()

      const { id: pet } = await spec.scenario.build.pet.create('Oreo', organization)

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/post')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          image: ['image.jpg'],
          pet: pet,
          location: location,
          publish: true
        })
        .end()

      const response = json<PostResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toMatchObject({
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
        organization: {
          id: expect.any(String),
          name: 'Name',
          contact: {
            mail: 'mail@example.com',
            phone: '+5599999999999',
            social: 'https://example.com/name'
          }
        }
      })
    })
  })

  // put /post/id
  describe('/post/id', () => {
    test('should save post', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id } = await spec.scenario.build.post.create()

      const [{ id: location }] = await spec.scenario.build.location.search()

      const { statusCode: status, json } = await spec.application
        .inject()
        .put(`/post/${id}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          image: ['image.jpg', 'image.jpg'],
          location: location,
          publish: true
        })
        .end()

      const response = json<PostResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        image: ['image.jpg', 'image.jpg'],
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
      })
    })
  })

  // put /post/id/publish
  describe('/post/id/publish', () => {
    test('should publish post', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id } = await spec.scenario.build.post.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .put(`/post/${id}/publish`)
        .headers({ Authorization: `Bearer ${hash}` })
        .body({ publish: true })
        .end()

      const response = json<PostResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id: expect.any(String),
        publish: true
      })
    })
  })

  // delete /post/id
  describe('/post/id', () => {
    test('should remove post', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: post } = await spec.scenario.build.post.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .delete(`/post/${post}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<RemovePostResponse>()

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
