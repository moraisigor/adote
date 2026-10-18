import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { ConfigurationProvider } from '@/module/configuration/provider'

import { AppModule } from './app.module'

const load = async () => {
  const application = await NestFactory.createApplicationContext(AppModule)

  const provider = application.get(ConfigurationProvider)

  await provider.breed.run()
  await provider.location.run()
  await provider.manager.run()

  await application.close()
}

load().catch((e) => {
  const logger = new Logger('Load')

  logger.error(e)

  process.exit(1)
})
