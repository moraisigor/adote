import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import type { AuthResponse, TokenResponse } from '@/module/auth/auth.response'
import type { Token } from '@/module/auth/type/token'
import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind'
import type { FavResponse } from '@/module/fav/fav.response'
import type { LocationResponse } from '@/module/location/location.response'
import type { OrganizationResponse } from '@/module/organization/organization.response'
import type { PetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import type { PostResponse } from '@/module/post/post.response'
import type { UserCurrentResponse, UserResponse } from '@/module/user/user.response'

import { encode } from '@/helper/string'

export type Authorization = {
  token?: Token
  renew?: Token
}

export class Scenario {
  public readonly BASIC_AUTHORIZATION = encode(
    `${process.env.AUTHENTICATION_BASIC_USER}:${process.env.AUTHENTICATION_BASIC_PASS}`
  )

  public readonly authorization: Authorization = {}

  constructor(private readonly application: NestFastifyApplication) {}

  build = {
    auth: {
      auth: async () => {
        const { json } = await this.application.inject().post('/auth').body({ phone: '+5599999999999' }).end()

        return json<AuthResponse>()
      }
    },
    breed: {
      list: async () => {
        const { json } = await this.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

        return json<BreedResponse[]>()
      }
    },
    configuration: {
      breed: async () => {
        const { json } = await this.application
          .inject()
          .post('/configuration/breed')
          .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
          .end()

        return json<BreedResponse[]>()
      },
      location: async () => {
        const { json } = await this.application
          .inject()
          .post('/configuration/location')
          .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
          .end()

        return json<LocationResponse[]>()
      },
      manager: async () => {
        const { json } = await this.application
          .inject()
          .post('/configuration/user')
          .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
          .end()

        return json<UserResponse>()
      }
    },
    fav: {
      add: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { id: post } = await this.build.post.create()

        const { json } = await this.application
          .inject()
          .post(`/user/fav/${post}`)
          .headers({ Authorization: `Bearer ${hash}` })
          .end()

        return json<FavResponse>()
      }
    },
    location: {
      search: async () => {
        const { json } = await this.application.inject().get('/location').query({ search: 'recife' }).end()

        return json<LocationResponse[]>()
      }
    },
    organization: {
      create: async (name: string = 'Name') => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { json } = await this.application
          .inject()
          .post('/organization')
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            name: name
          })
          .end()

        return json<OrganizationResponse>()
      },
      save: async (name: string = 'Name') => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const [{ id }] = await this.build.user.organization()

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put(`/organization/${id}`)
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            name: name,
            contact: {
              mail: 'mail@example.com',
              phone: '+5599999999999',
              social: 'https://example.com/name'
            },
            location: location
          })
          .end()

        return json<OrganizationResponse>()
      }
    },
    pet: {
      create: async (name: string = 'Oreo', organization?: string) => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const list = await this.build.breed.list()

        const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

        const { json } = await this.application
          .inject()
          .post('/pet')
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            name: name,
            kind: Kind.DOG,
            size: Size.MEDIUM,
            gender: Gender.MALE,
            breed: breed,
            organization: organization
          })
          .end()

        return json<PetResponse>()
      }
    },
    post: {
      create: async (name: string = 'Oreo', organization?: string) => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { id: pet } = await this.build.pet.create(name, organization)

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
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

        return json<PostResponse>()
      }
    },
    user: {
      current: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { json } = await this.application
          .inject()
          .get('/user/current')
          .headers({ Authorization: `Bearer ${hash}` })
          .end()

        return json<UserCurrentResponse>()
      },
      organization: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { json } = await this.application
          .inject()
          .get('/user/organization')
          .headers({ Authorization: `Bearer ${hash}` })
          .end()

        return json<OrganizationResponse[]>()
      },
      save: async (name: string = 'Name') => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put('/user')
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            name: name,
            contact: {
              mail: 'mail@example.com',
              phone: '+5599999999999',
              social: 'https://example.com/name'
            },
            location: location
          })
          .end()

        return json<UserResponse>()
      }
    }
  }

  async authenticate() {
    await this.application.inject().post('/auth').body({ phone: '+5599999999999' }).end()

    const { json } = await this.application
      .inject()
      .post('/auth/verify')
      .body({
        phone: '+5599999999999',
        code: '999999'
      })
      .end()

    const response = json<TokenResponse>()

    this.authorization.token = response.token
    this.authorization.renew = response.renew
  }

  async breed() {
    await this.build.configuration.breed()
  }

  async fav() {
    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.authenticate()

    await this.build.user.save()
  }

  async location() {
    await this.build.configuration.location()
  }

  async organization() {
    await this.authenticate()
  }

  async pet() {
    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.authenticate()

    await this.build.organization.create()
  }

  async post() {
    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.authenticate()

    await this.build.organization.create()

    await this.build.user.save()
    await this.build.organization.save()
  }

  async user() {
    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.authenticate()

    await this.build.user.save()
  }

  async manager() {
    await this.build.configuration.breed()
    await this.build.configuration.location()
    await this.build.configuration.manager()

    await this.authenticate()

    await this.build.user.save()
  }
}
