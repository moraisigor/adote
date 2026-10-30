import { ConfigService } from '@nestjs/config'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { ImageStorage } from '@/module/image/image.storage'

import { Scenario } from './scenario'
import { AppModule } from '@/app.module'
import { configure } from '@/configure'
import { RepositoryConfigFactory } from '@/repository.config.factory'
import { RequestConfigFactory } from '@/request.config.factory'

type Option = {
  throttler: boolean
}

export class Spec {
  constructor(
    readonly scenario: Scenario,
    private readonly repository: MongoMemoryServer,
    readonly application: NestFastifyApplication,
    readonly option: Option
  ) {}

  public static build = async (option: Option = { throttler: true }) => {
    const { throttler } = option

    const repository = await MongoMemoryServer.create()

    const module = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(RepositoryConfigFactory)
      .useValue({
        createMongooseOptions: () => ({
          uri: repository.getUri()
        })
      })
      .overrideProvider(RequestConfigFactory)
      .useFactory({
        factory: (config: ConfigService) => ({
          createThrottlerOptions: () => ({
            skipIf: () => !throttler,
            throttlers: new RequestConfigFactory(config).createThrottlerOptions()
          })
        }),
        inject: [ConfigService]
      })
      .compile()

    const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await configure(application)

    return new Spec(new Scenario(application), repository, application, option)
  }

  async start() {
    await this.application.init()
    await this.application.getHttpAdapter().getInstance().ready()

    const { client } = this.application.get(ImageStorage, { strict: false })

    this.scenario.bucket.attach(client)
  }

  async stop() {
    await this.application.close()

    await this.repository.stop()
  }
}
