import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ConfigurationProvider } from './module/configuration/provider'

const load = async () => {
  const application = await NestFactory.createApplicationContext(AppModule)

  const provider = application.get(ConfigurationProvider)

  await provider.breed.run()
  await provider.location.run()
  await provider.manager.run()

  await application.close()
}

load().catch((e) => console.error(e))
