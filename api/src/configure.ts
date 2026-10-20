import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import compress from '@fastify/compress'
import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import { split } from 'lodash'

export const configure = async (application: NestFastifyApplication) => {
  const config = application.get(ConfigService)

  application.enableCors({
    origin: split(config.getOrThrow<string>('APP_ORIGIN'), ','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })

  await application.register(cookie)
  await application.register(helmet)
  await application.register(compress)

  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  application.setGlobalPrefix('/api')

  application.enableShutdownHooks()
}
