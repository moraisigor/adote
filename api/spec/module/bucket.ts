import { HeadObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import { spyOn } from 'bun:test'

export class Bucket {
  private readonly store = new Map<string, string>()

  set(key: string, user: string) {
    this.store.set(key, user)
  }
  attach(client: S3Client) {
    spyOn(client, 'send').mockImplementation((command: unknown) => {
      const { Key: key = '' } = (command as { input: { Key?: string } }).input

      if (command instanceof HeadObjectCommand) {
        const user = this.store.get(key)

        if (user) {
          return Promise.resolve({ Metadata: { user } })
        }

        return Promise.reject(new Error())
      }

      this.store.delete(key)

      return Promise.resolve()
    })
  }
}
