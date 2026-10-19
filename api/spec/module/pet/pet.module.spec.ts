import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { Types } from 'mongoose'

import { Kind } from '@/module/breed/type/kind'
import type { PetResponse, RemovePetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'

import { Spec } from '../spec'

describe('pet module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.pet()
  })

  // get /pet
  describe('/pet', () => {
    test('should list pet', async () => {
      const { hash } = spec.scenario

      await spec.scenario.build.pet.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get('/pet')
        .cookies({ token: hash })
        .query({ page: '1', amount: '10' })
        .end()

      const response = json<PetResponse[]>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toHaveLength(1)

      expect(response).toMatchObject([
        {
          id: expect.any(String),
          name: 'Oreo',
          kind: Kind.DOG,
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: {
            id: expect.any(String),
            name: 'Buldogue Inglês'
          }
        }
      ])
    })

    test('should not list pet organization without permission', async () => {
      const { token: { hash } = { hash: '' } } = await spec.scenario.session('+5511999999999')

      const [{ id: organization }] = await spec.scenario.build.user.organization()

      const { statusCode: status } = await spec.application
        .inject()
        .get('/pet')
        .query({ page: '1', amount: '10', organization })
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  // get /pet/id
  describe('/pet/id', () => {
    test('should get pet', async () => {
      const { hash } = spec.scenario

      const { id } = await spec.scenario.build.pet.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .get(`/pet/${id}`)
        .cookies({ token: hash })
        .end()

      const response = json<PetResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id,
        name: 'Oreo',
        kind: Kind.DOG,
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: {
          id: expect.any(String),
          name: 'Buldogue Inglês'
        }
      })
    })

    test('should not get unknown pet', async () => {
      const { hash } = spec.scenario

      const id = new Types.ObjectId().toHexString()

      const { statusCode: status } = await spec.application
        .inject()
        .get(`/pet/${id}`)
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })

    test('should not get pet without permission', async () => {
      const { token: { hash } = { hash: '' } } = await spec.scenario.session('+5511999999999')

      const { id } = await spec.scenario.build.pet.create()

      const { statusCode: status } = await spec.application
        .inject()
        .get(`/pet/${id}`)
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  // post /pet
  describe('/pet', () => {
    test('should create pet', async () => {
      const { hash } = spec.scenario

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/pet')
        .cookies({ token: hash })
        .body({
          name: 'Oreo',
          kind: Kind.DOG,
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: breed
        })
        .end()

      const response = json<PetResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Oreo',
        kind: Kind.DOG,
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: {
          id: expect.any(String),
          name: 'Buldogue Inglês'
        }
      })
    })

    test('should create pet with organization', async () => {
      const { hash } = spec.scenario

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

      const [{ id: organization }] = await spec.scenario.build.user.organization()

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/pet')
        .cookies({ token: hash })
        .body({
          name: 'Oreo',
          kind: Kind.DOG,
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: breed,
          organization: organization
        })
        .end()

      const response = json<PetResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Oreo',
        kind: Kind.DOG,
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: {
          id: expect.any(String),
          name: 'Buldogue Inglês'
        }
      })
    })
  })

  // put /pet/id
  describe('/pet/id', () => {
    test('should save pet', async () => {
      const { hash } = spec.scenario

      const { id } = await spec.scenario.build.pet.create()

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Sem Raça Definida') ?? { id: null }

      const { statusCode: status, json } = await spec.application
        .inject()
        .put(`/pet/${id}`)
        .cookies({ token: hash })
        .body({
          name: 'Estopinha',
          kind: Kind.DOG,
          size: Size.MEDIUM,
          gender: Gender.FEMALE,
          breed: breed
        })
        .end()

      const response = json<PetResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        name: 'Estopinha',
        kind: Kind.DOG,
        size: Size.MEDIUM,
        gender: Gender.FEMALE,
        breed: {
          id: expect.any(String),
          name: 'Sem Raça Definida'
        }
      })
    })

    test('should not save unknown pet', async () => {
      const { hash } = spec.scenario

      const id = new Types.ObjectId().toHexString()

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Sem Raça Definida') ?? { id: null }

      const { statusCode: status } = await spec.application
        .inject()
        .put(`/pet/${id}`)
        .cookies({ token: hash })
        .body({
          name: 'Estopinha',
          kind: Kind.DOG,
          size: Size.MEDIUM,
          gender: Gender.FEMALE,
          breed: breed
        })
        .end()

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })

    test('should not save pet without permission', async () => {
      const { token: { hash } = { hash: '' } } = await spec.scenario.session('+5511999999999')

      const { id } = await spec.scenario.build.pet.create()

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Sem Raça Definida') ?? { id: null }

      const { statusCode: status } = await spec.application
        .inject()
        .put(`/pet/${id}`)
        .cookies({ token: hash })
        .body({
          name: 'Estopinha',
          kind: Kind.DOG,
          size: Size.MEDIUM,
          gender: Gender.FEMALE,
          breed: breed
        })
        .end()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  // delete /pet/id
  describe('/pet/id', () => {
    test('should remove pet', async () => {
      const { hash } = spec.scenario

      const { id } = await spec.scenario.build.pet.create()

      const { statusCode: status, json } = await spec.application
        .inject()
        .delete(`/pet/${id}`)
        .cookies({ token: hash })
        .end()

      const response = json<RemovePetResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id
      })
    })

    test('should not remove unknown pet', async () => {
      const { hash } = spec.scenario

      const id = new Types.ObjectId().toHexString()

      const { statusCode: status } = await spec.application
        .inject()
        .delete(`/pet/${id}`)
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })

    test('should not remove pet without permission', async () => {
      const { token: { hash } = { hash: '' } } = await spec.scenario.session('+5511999999999')

      const { id } = await spec.scenario.build.pet.create()

      const { statusCode: status } = await spec.application
        .inject()
        .delete(`/pet/${id}`)
        .cookies({ token: hash })
        .end()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
