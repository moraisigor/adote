import { Injectable, Logger } from '@nestjs/common'

import { DeleteObjectsCommand } from '@aws-sdk/client-s3'

import { ImageStorage } from '../image.storage'

@Injectable()
export class RemoveImageProvider {
  private readonly logger = new Logger(RemoveImageProvider.name)

  constructor(private readonly storage: ImageStorage) {}

  async run(keys: string[]) {
    const { Errors: error = [] } = await this.storage.client.send(
      new DeleteObjectsCommand({
        Bucket: this.storage.name,
        Delete: { Objects: keys.map((key) => ({ Key: key })), Quiet: true }
      })
    )

    const message = error.map((e) => `remove ${e.Key}: ${e.Code}`).join('\n')

    this.logger.error(message)
  }
}
