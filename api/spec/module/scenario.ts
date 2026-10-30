import { JwtService } from '@nestjs/jwt'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { spyOn } from 'bun:test'
import { isNil } from 'lodash'

import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind'
import { ConfigurationProvider } from '@/module/configuration/provider'
import type { FavResponse } from '@/module/fav/fav.response'
import type { ImageResponse } from '@/module/image/image.response'
import { ImageKind } from '@/module/image/type/image'
import type { LocationResponse } from '@/module/location/location.response'
import { CodeNotifyProvider } from '@/module/notify/provider/code.notify.provider'
import type { OrganizationResponse } from '@/module/organization/organization.response'
import type { PetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import type { PostResponse } from '@/module/post/post.response'
import { Role } from '@/module/user/type/role'
import type { UserResponse } from '@/module/user/user.response'

import { Authentication, type Session } from './authentication'
import { Bucket } from './bucket'

export class Scenario {
  private readonly bucket = new Bucket()

  private readonly authentication = new Authentication()

  build = {
    auth: {
      auth: async (phone: string) => {
        const provider = spyOn(
          this.application.get(CodeNotifyProvider, {
            strict: false
          }),
          'run'
        )

        try {
          await this.application.inject().post('/api/auth').body({ phone }).end()

          const [, code] = provider.mock.calls.pop() ?? []

          return { phone, code }
        } finally {
          provider.mockRestore()
        }
      }
    },
    adopter: {
      create: async (name: string = 'Oreo', organization?: string) => {
        const {
          pet: { id: pet }
        } = await this.build.post.create(name, true, organization)

        await this.application
          .inject()
          .post('/api/adopter')
          .body({
            name: 'Name',
            phone: '+5511999999999',
            pet: pet
          })
          .end()
      }
    },
    breed: {
      list: async () => {
        const { json } = await this.application.inject().get('/api/breed').query({ kind: Kind.DOG }).end()

        return json<BreedResponse[]>()
      }
    },
    configuration: {
      breed: () => this.application.get(ConfigurationProvider).breed.run(),
      location: () => this.application.get(ConfigurationProvider).location.run(),
      manager: () => this.application.get(ConfigurationProvider).manager.run()
    },
    fav: {
      add: async () => {
        const { token } = this.authentication.get()

        const { id: post } = await this.build.post.create()

        const { json } = await this.application
          .inject()
          .post(`/api/user/fav/${post}`)
          .cookies({ token: token.hash })
          .end()

        return json<FavResponse>()
      }
    },
    image: {
      save: async (kind: ImageKind) => {
        const { id, token } = this.authentication.get()

        const { json } = await this.application
          .inject()
          .post('/api/image')
          .cookies({ token: token.hash })
          .body({
            kind,
            size: 1024,
            extension: 'image/webp'
          })
          .end()

        const { key } = json<ImageResponse>()

        this.bucket.set(key, id)

        return key
      }
    },
    location: {
      search: async () => {
        const { json } = await this.application
          .inject()
          .get('/api/location')
          .query({ search: 'recife' })
          .end()

        return json<LocationResponse[]>()
      }
    },
    organization: {
      create: async (name: string = 'Name') => {
        const { token } = this.authentication.get()

        const { json } = await this.application
          .inject()
          .post('/api/organization')
          .cookies({ token: token.hash })
          .body({
            name: name
          })
          .end()

        return json<OrganizationResponse>()
      },
      save: async (name: string = 'Name') => {
        const { token } = this.authentication.get()

        const [{ id }] = await this.build.user.organization()

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put(`/api/organization/${id}`)
          .cookies({ token: token.hash })
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
        const { token } = this.authentication.get()

        const list = await this.build.breed.list()

        const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

        const { json } = await this.application
          .inject()
          .post('/api/pet')
          .cookies({ token: token.hash })
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
      create: async (name: string = 'Oreo', publish: boolean = true, organization?: string) => {
        const { token } = this.authentication.get()

        const image = await this.build.image.save(ImageKind.POST)

        const { id: pet } = await this.build.pet.create(name, organization)

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .post('/api/post')
          .cookies({ token: token.hash })
          .body({
            image: [image],
            pet: pet,
            location: location,
            publish: publish
          })
          .end()

        return json<PostResponse>()
      }
    },
    user: {
      current: async () => {
        const { token } = this.authentication.get()

        const { json } = await this.application
          .inject()
          .get('/api/user/current')
          .cookies({ token: token.hash })
          .end()

        return json<UserResponse>()
      },
      organization: async () => {
        const { token } = this.authentication.get()

        const { json } = await this.application
          .inject()
          .get('/api/user/organization')
          .cookies({ token: token.hash })
          .end()

        return json<OrganizationResponse[]>()
      },
      save: async (name: string = 'Name') => {
        const { token } = this.authentication.get()

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put('/api/user')
          .cookies({ token: token.hash })
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

  constructor(private readonly application: NestFastifyApplication) {}

  session(key: Role = Role.MEMBER): Session {
    return this.authentication.get(key)
  }

  async account(phone: string): Promise<Session> {
    const { phone: account, code } = await this.build.auth.auth(phone)

    const { cookies } = await this.application
      .inject()
      .post('/api/auth/verify')
      .body({
        phone: account,
        code
      })
      .end()

    const token = cookies.find((e) => e.name === 'token')
    const renew = cookies.find((e) => e.name === 'renew')

    if (isNil(token)) {
      throw new Error()
    }

    if (isNil(renew)) {
      throw new Error()
    }

    const { sub: user } = this.application
      .get(JwtService, { strict: false })
      .decode<{ sub: string }>(token.value)

    return {
      id: user,
      token: {
        hash: token.value,
        expire: token.expires ?? new Date()
      },
      renew: {
        hash: renew.value,
        expire: renew.expires ?? new Date()
      }
    }
  }

  async authenticate(phone: string = '+5599999999999', role: Role = Role.MEMBER) {
    const session = await this.account(phone)

    this.authentication.set(role, session)
  }

  async adopter() {
    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.authenticate()
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

  async image() {
    await this.authenticate()
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

    await this.build.organization.create()

    await this.build.user.save()
    await this.build.organization.save()
  }

  async manager() {
    const { phone, role } = await this.build.configuration.manager()

    await this.authenticate(phone, role)
  }
}
