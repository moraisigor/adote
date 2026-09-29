import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose'

@Injectable()
export class RepositoryConfigFactory implements MongooseOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.getOrThrow<string>('REPOSITORY_URI'),
      user: this.config.getOrThrow<string>('REPOSITORY_USER'),
      pass: this.config.getOrThrow<string>('REPOSITORY_PASS'),
      dbName: this.config.getOrThrow<string>('REPOSITORY_NAME')
    }
  }
}
