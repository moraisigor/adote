import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { spyOn } from 'bun:test'
import { isNil } from 'lodash'

import type { AdopterResponse } from '@/module/adopter/adopter.response'
import type { Token } from '@/module/auth/type/token'
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
import type { UserResponse } from '@/module/user/user.response'

import { Bucket } from './bucket'

export type Authorization = {
  user?: string
  token?: Token
  renew?: Token
}

export class Scenario {
  public readonly bucket = new Bucket()

  public readonly authorization: Authorization = {}

  get hash(): string {
    const { token } = this.authorization

    if (token) {
      return token.hash
    }

    throw new Error('the authorization is null')
  }

  constructor(private readonly application: NestFastifyApplication) {}

  build = {
    auth: {
      auth: async (phone: string = '+5599999999999') => {
        const provider = spyOn(
          this.application.get(CodeNotifyProvider, {
            strict: false
          }),
          'run'
        )

        try {
          await this.application.inject().post('/auth').body({ phone }).end()

          const [, code] = provider.mock.calls.pop() ?? []

          return { phone, code }
        } finally {
          provider.mockRestore()
        }
      }
    },
    image: {
      save: async (kind: ImageKind) => {
        const { user = '' } = this.authorization

        const { json } = await this.application
          .inject()
          .post('/image')
          .cookies({ token: this.hash })
          .body({
            kind,
            size: 1024,
            extension: 'image/webp'
          })
          .end()

        const { key } = json<ImageResponse>()

        this.bucket.set(key, user)

        return key
      }
    },
    adopter: {
      create: async () => {
        const {
          pet: { id: pet }
        } = await this.build.post.create()

        const { json } = await this.application
          .inject()
          .post('/adopter')
          .body({
            name: 'Name',
            phone: '+5511999999999',
            pet: pet
          })
          .end()

        return json<AdopterResponse[]>()
      }
    },
    breed: {
      list: async () => {
        const { json } = await this.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

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
        const { id: post } = await this.build.post.create()

        const { json } = await this.application
          .inject()
          .post(`/user/fav/${post}`)
          .cookies({ token: this.hash })
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
        const { json } = await this.application
          .inject()
          .post('/organization')
          .cookies({ token: this.hash })
          .body({
            name: name
          })
          .end()

        return json<OrganizationResponse>()
      },
      save: async (name: string = 'Name') => {
        const [{ id }] = await this.build.user.organization()

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put(`/organization/${id}`)
          .cookies({ token: this.hash })
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
        const list = await this.build.breed.list()

        const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

        const { json } = await this.application
          .inject()
          .post('/pet')
          .cookies({ token: this.hash })
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
        const image = await this.build.image.save(ImageKind.POST)

        const { id: pet } = await this.build.pet.create(name, organization)

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .post('/post')
          .cookies({ token: this.hash })
          .body({
            image: [image],
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
        const { json } = await this.application
          .inject()
          .get('/user/current')
          .cookies({ token: this.hash })
          .end()

        return json<UserResponse>()
      },
      organization: async () => {
        const { json } = await this.application
          .inject()
          .get('/user/organization')
          .cookies({ token: this.hash })
          .end()

        return json<OrganizationResponse[]>()
      },
      save: async (name: string = 'Name') => {
        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put('/user')
          .cookies({ token: this.hash })
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

  async session(account?: string): Promise<Authorization> {
    const { phone, code } = await this.build.auth.auth(account)

    const { cookies } = await this.application
      .inject()
      .post('/auth/verify')
      .body({
        phone,
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
      user: user,
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

  async authenticate(account?: string) {
    const session = await this.session(account)

    Object.assign(this.authorization, session)
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
    await this.build.configuration.breed()
    await this.build.configuration.location()
    await this.build.configuration.manager()

    const account = this.application.get(ConfigService).getOrThrow<string>('MANAGER_ACCOUNT')

    await this.authenticate(account)

    await this.build.user.save()
  }
}
