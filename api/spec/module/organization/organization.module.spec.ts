import { HttpStatus } from '@nestjs/common'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type {
  OrganizationResponse,
  RemoveOrganizationResponse
} from '@/module/organization/organization.response'

import { Spec } from '../spec'

describe('organization module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.organization()
  })

  // get /organization/id
  describe('/organization/id', () => {
    test('should get organization', async () => {
      const { id } = await spec.scenario.build.organization.create()

      const { statusCode: status, json } = await spec.application.inject().get(`/organization/${id}`).end()

      const response = json<OrganizationResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id,
        name: 'Name'
      })
    })
  })

  // post /organization
  describe('/organization', () => {
    test('should create organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { statusCode: status, json } = await spec.application
        .inject()
        .post('/organization')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Create'
        })
        .end()

      const response = json<OrganizationResponse>()

      expect(status).toBe(HttpStatus.CREATED)

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Create'
      })
    })
  })

  // put /organization/id
  describe('/organization/id', () => {
    test('should save organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id } = await spec.scenario.build.organization.create('Save')

      const { statusCode: status, json } = await spec.application
        .inject()
        .put(`/organization/${id}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Save',
          contact: {
            mail: 'mail@example.com',
            phone: '+5599999999999'
          }
        })
        .end()

      const response = json<OrganizationResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id,
        name: 'Save',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999'
        }
      })
    })
  })

  // delete /organization/id
  describe('/organization/id', () => {
    test('should remove organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id } = await spec.scenario.build.organization.create('Remove')

      const { statusCode: status, json } = await spec.application
        .inject()
        .delete(`/organization/${id}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<RemoveOrganizationResponse>()

      expect(status).toBe(HttpStatus.OK)

      expect(response).toMatchObject({
        id
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})

describe('organization module', async () => {
  describe('as manager', async () => {
    const spec = await Spec.build()

    beforeAll(async () => {
      await spec.start()

      await spec.scenario.manager()
    })

    // get /organization
    describe('/organization', () => {
      test('should list organization', async () => {
        const {
          authorization: { token: { hash } = { hash: '' } }
        } = spec.scenario

        await spec.scenario.build.organization.create()

        await spec.scenario.build.organization.save()

        const { statusCode: status, json } = await spec.application
          .inject()
          .get('/organization')
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

    afterAll(async () => {
      await spec.stop()
    })
  })
})
