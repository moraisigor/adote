import {
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type S3Client
} from '@aws-sdk/client-s3'
import { spyOn } from 'bun:test'

type Object = {
  user: string
  modify: Date
}

export class Bucket {
  private readonly store = new Map<string, Object>()

  has(key: string): boolean {
    return this.store.has(key)
  }

  set(key: string, user: string, modify: Date = new Date()) {
    this.store.set(key, {
      user,
      modify
    })
  }

  attach(client: S3Client) {
    spyOn(client, 'send').mockImplementation((command: unknown) => {
      const { Key: key = '' } = (command as { input: { Key?: string } }).input

      if (command instanceof HeadObjectCommand) {
        const object = this.store.get(key)

        if (object) {
          return Promise.resolve({ Metadata: { user: object.user } })
        }

        return Promise.reject(new Error())
      }

      if (command instanceof ListObjectsV2Command) {
        const list = this.store.entries().map(([key, { modify }]) => ({
          Key: key,
          LastModified: modify
        }))

        return Promise.resolve({ Contents: list })
      }

      if (command instanceof DeleteObjectsCommand) {
        const { Objects: list = [] } = command.input.Delete ?? {}

        for (const { Key: key = '' } of list) {
          this.store.delete(key)
        }

        return Promise.resolve({ Errors: [] })
      }

      this.store.delete(key)

      return Promise.resolve()
    })
  }
}
