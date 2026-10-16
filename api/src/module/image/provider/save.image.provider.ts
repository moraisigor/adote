import { Injectable } from '@nestjs/common'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { unique } from '@/helper/id'

import { SaveImageRequest } from '../image.request'
import { ImageResponse } from '../image.response'
import { ImageStorage } from '../image.storage'
import { ImageExtension } from '../type/image'

const USER = 'x-amz-meta-user'

@Injectable()
export class SaveImageProvider {
  constructor(private readonly storage: ImageStorage) {}

  async run(request: SaveImageRequest, current: string): Promise<ImageResponse> {
    const { kind, size, extension } = request

    const key = `${kind}/${unique(24)}.${ImageExtension[extension]}`

    const object = new PutObjectCommand({
      Key: key,
      Bucket: this.storage.name,
      ContentType: extension,
      ContentLength: size,
      Metadata: {
        user: current
      }
    })

    const url = await getSignedUrl(this.storage.client, object, {
      expiresIn: 60,
      signableHeaders: new Set(['content-type', 'content-length', USER]),
      unhoistableHeaders: new Set([USER])
    })

    return new ImageResponse(key, url)
  }
}
