import { getModelToken } from '@nestjs/mongoose'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import type { Model } from 'mongoose'

import { Breed } from '@/module/breed/repository/breed.schema'
import { Location } from '@/module/location/repository/location.schema'
import { User } from '@/module/user/repository/user.schema'

import { Spec } from '../spec'

describe('configuration module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // set breed provider
  describe('set breed provider', () => {
    test('should load breed list', async () => {
      const model = spec.application.get<Model<Breed>>(getModelToken(Breed.name))

      await spec.scenario.build.configuration.breed()

      const result = await model.find()

      expect(result).toHaveLength(67)
    })
  })

  // set location provider
  describe('set location provider', () => {
    test('should load location list', async () => {
      const model = spec.application.get<Model<Location>>(getModelToken(Location.name))

      await spec.scenario.build.configuration.location()

      const result = await model.find()

      expect(result).toHaveLength(5694)
    })
  })

  // set manager provider
  describe('set manager provider', () => {
    test('should load manager', async () => {
      const model = spec.application.get<Model<User>>(getModelToken(User.name))

      await spec.scenario.build.configuration.manager()

      const result = await model.findOne({ phone: '+5581999999999' })

      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'Oreo',
        phone: '+5581999999999'
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
