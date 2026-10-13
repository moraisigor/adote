import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class SaveImageProvider {
  private readonly name: string
  private readonly client: S3Client

  constructor(private readonly config: ConfigService) {
    this.name = this.config.getOrThrow<string>('STORAGE_NAME')
    this.client = new S3Client({
      region: this.config.getOrThrow<string>('STORAGE_REGION'),
      endpoint: this.config.getOrThrow<string>('STORAGE_PATH'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('STORAGE_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('STORAGE_SECRET')
      }
    })
  }

  async run(key: string) {
    const object = new PutObjectCommand({
      Key: key,
      Bucket: this.name
    })

    return getSignedUrl(this.client, object, {
      expiresIn: 60
    })
  }
}
