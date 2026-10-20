import './sentry'

import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { configure } from './configure'
import { configuration } from './env.configuration'

const application = async () => {
  const { PROXY_HOP = 1 } = configuration

  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: PROXY_HOP
    })
  )

  await configure(application)

  const config = application.get(ConfigService)

  await application.listen(config.get<number>('PORT', 9999), '0.0.0.0')
}

application().catch((e) => {
  const logger = new Logger('Application')

  logger.error(e)

  return process.exit(1)
})
