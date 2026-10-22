import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { ImageStorage } from '@/module/image/image.storage'

import { Scenario } from './scenario'
import { AppModule } from '@/app.module'
import { configure } from '@/configure'
import { RepositoryConfigFactory } from '@/repository.config.factory'
import { RequestConfigFactory } from '@/request.config.factory'

export class Spec {
  constructor(
    private readonly repository: MongoMemoryServer,
    readonly scenario: Scenario,
    readonly application: NestFastifyApplication
  ) {}

  public static build = async () => {
    const repository = await MongoMemoryServer.create()

    const module = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(RequestConfigFactory)
      .useValue({
        createThrottlerOptions: () => ({
          throttlers: [],
          skipIf: () => true
        })
      })
      .overrideProvider(RepositoryConfigFactory)
      .useValue({
        createMongooseOptions: () => ({
          uri: repository.getUri()
        })
      })
      .compile()

    const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await configure(application)

    return new Spec(repository, new Scenario(application), application)
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
