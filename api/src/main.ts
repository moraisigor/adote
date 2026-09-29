import './instrument'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'

import compress from '@fastify/compress'
import helmet from '@fastify/helmet'

import { AppModule } from './app.module'

const application = async () => {
  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    { cors: true }
  )

  await application.register(helmet)
  await application.register(compress)

  application.setGlobalPrefix('/api')

  application.useGlobalPipes(new ValidationPipe({ transform: true }))

  await application.listen(process.env.PORT ?? 9000, '0.0.0.0')
}

application()
