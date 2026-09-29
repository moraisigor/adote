import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class SaveImageProvider {
  private readonly client: S3Client

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      region: this.config.getOrThrow<string>('AMAZON_REGION')
    })
  }

  async run(key: string) {
    const value = new PutObjectCommand({
      Key: key,
      Bucket: this.config.getOrThrow<string>('STORAGE_NAME')
    })

    return getSignedUrl(this.client, value, {
      expiresIn: 60
    })
  }
}
