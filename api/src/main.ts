import './sentry'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'

import compress from '@fastify/compress'
import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import { split } from 'lodash'

import { AppModule } from './app.module'
import { validate } from './env.configuration'

const application = async () => {
  const { PROXY_HOP = 1 } = validate(process.env)

  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: PROXY_HOP
    })
  )

  const config = application.get(ConfigService)

  application.enableCors({
    origin: split(config.getOrThrow<string>('APP_ORIGIN'), ','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })

  await application.register(cookie)
  await application.register(helmet)
  await application.register(compress)

  application.setGlobalPrefix('/api')

  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  application.enableShutdownHooks()

  await application.listen(config.get<number>('PORT', 9999), '0.0.0.0')
}

application().catch((e) => console.error(e))
