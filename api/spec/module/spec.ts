import { ConfigService } from '@nestjs/config'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'
import { RedisMemoryServer } from 'redis-memory-server'

import { ImageStorage } from '@/module/image/image.storage'
import { MemoryThrottlerStorage } from '@/module/memory/memory.throttler.storage'

import { Scenario } from './scenario'
import { AppModule } from '@/app.module'
import { configure } from '@/configure'
import { MemoryConfigFactory } from '@/memory.config.factory'
import { RepositoryConfigFactory } from '@/repository.config.factory'
import { RequestConfigFactory } from '@/request.config.factory'

type Option = {
  throttler: boolean
}

export class Spec {
  constructor(
    readonly scenario: Scenario,
    private readonly memory: RedisMemoryServer,
    private readonly repository: MongoMemoryServer,
    readonly application: NestFastifyApplication,
    readonly option: Option
  ) {}

  public static build = async (option: Option = { throttler: false }) => {
    const { throttler } = option

    const memory = await RedisMemoryServer.create()
    const repository = await MongoMemoryServer.create()

    const [host, port] = await Promise.all([memory.getHost(), memory.getPort()])

    const module = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(MemoryConfigFactory)
      .useValue({
        createMemoryOptions: () => ({
          uri: `redis://${host}:${port}`
        })
      })
      .overrideProvider(RepositoryConfigFactory)
      .useValue({
        createMongooseOptions: () => ({
          uri: repository.getUri()
        })
      })
      .overrideProvider(RequestConfigFactory)
      .useFactory({
        factory: (config: ConfigService, storage: MemoryThrottlerStorage) => ({
          createThrottlerOptions: () => {
            const factory = new RequestConfigFactory(config, storage)

            const option = factory.createThrottlerOptions()
            option.skipIf = () => !throttler

            return option
          }
        }),
        inject: [ConfigService, MemoryThrottlerStorage]
      })
      .compile()

    const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await configure(application)

    return new Spec(new Scenario(application), memory, repository, application, option)
  }

  async start() {
    await this.application.init()
    await this.application.getHttpAdapter().getInstance().ready()

    const { client } = this.application.get(ImageStorage, { strict: false })

    this.scenario.bucket.attach(client)
  }

  async stop() {
    await this.application.close()

    await this.memory.stop()
    await this.repository.stop()
  }
}
