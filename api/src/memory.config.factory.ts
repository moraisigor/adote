import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

type MemoryModuleOptions = {
  uri: string
}

@Injectable()
export class MemoryConfigFactory {
  constructor(private readonly config: ConfigService) {}

  createMemoryOptions(): MemoryModuleOptions {
    return {
      uri: this.config.getOrThrow<string>('MEMORY_URI')
    }
  }
}
