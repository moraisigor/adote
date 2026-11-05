import { Injectable } from '@nestjs/common'

import { paginateListObjectsV2 as paginate } from '@aws-sdk/client-s3'
import { isBefore } from 'date-fns'
import { isNil } from 'lodash-es'

import { ImageStorage } from '../image.storage'
import { IMAGE_PATTERN } from '../type/image'

@Injectable()
export class ListImageProvider {
  constructor(private readonly storage: ImageStorage) {}

  async *run(before: Date): AsyncGenerator<string[]> {
    const configuration = {
      client: this.storage.client,
      stopOnSameToken: true
    }

    const list = paginate(configuration, {
      Bucket: this.storage.name
    })

    for await (const { Contents: content = [] } of list) {
      yield content
        .filter((e) => {
          const { Key: key, LastModified: modify } = e

          if (isNil(key)) return false
          if (isNil(modify)) return false

          if (isBefore(modify, before)) {
            return IMAGE_PATTERN.test(key)
          }

          return true
        })
        .map(({ Key: key }) => key as string)
    }
  }
}
