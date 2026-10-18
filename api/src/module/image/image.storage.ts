import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class ImageStorage {
  readonly name: string
  readonly client: S3Client

  constructor(private readonly config: ConfigService) {
    this.name = this.config.getOrThrow<string>('STORAGE_NAME')
    this.client = new S3Client({
      region: this.config.getOrThrow<string>('STORAGE_REGION'),
      endpoint: this.config.getOrThrow<string>('STORAGE_PATH'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('STORAGE_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('STORAGE_SECRET')
      },
      requestChecksumCalculation: 'WHEN_REQUIRED'
    })
  }
}
