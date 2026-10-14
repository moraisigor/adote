import { Injectable } from '@nestjs/common'

import { HeadObjectCommand } from '@aws-sdk/client-s3'

import { ImageStorage } from '../image.storage'
import { isKey, type ImageKind } from '../type/image'

@Injectable()
export class ValidateImageProvider {
  constructor(private readonly storage: ImageStorage) {}

  private async exists(key: string, current: string): Promise<boolean> {
    try {
      const { Metadata: option = {} } = await this.storage.client.send(
        new HeadObjectCommand({ Key: key, Bucket: this.storage.name })
      )

      return option.user === current
    } catch {
      return false
    }
  }

  async run(keys: string[], kind: ImageKind, current: string): Promise<boolean> {
    if (keys.every((key) => isKey(key, kind))) {
      const values = await Promise.all(keys.map((key) => this.exists(key, current)))

      return values.every(Boolean)
    }

    return false
  }
}
