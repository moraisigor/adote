import { Injectable, Logger } from '@nestjs/common'

import { DeleteObjectCommand } from '@aws-sdk/client-s3'

import { ImageStorage } from '../image.storage'
import { IMAGE_PATTERN } from '../type/image'

@Injectable()
export class RemoveImageProvider {
  private readonly logger = new Logger(RemoveImageProvider.name)

  constructor(private readonly storage: ImageStorage) {}

  async run(keys: string[]) {
    const list = keys.filter((e) => IMAGE_PATTERN.test(e))

    await Promise.all(
      list.map((key) =>
        this.storage.client
          .send(new DeleteObjectCommand({ Key: key, Bucket: this.storage.name }))
          .catch((e) => this.logger.error(`remove ${key}`, e))
      )
    )
  }
}
