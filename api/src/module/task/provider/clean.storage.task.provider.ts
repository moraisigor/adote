import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { difference, first, groupBy as group, map, split } from 'lodash'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'
import { OrganizationRepository } from '@/module/organization/repository/organization.repository'
import { PostRepository } from '@/module/post/repository/post.repository'
import { UserRepository } from '@/module/user/repository/user.repository'

const DURATION = 24 * 60 * 60 * 1000

@Injectable()
export class CleanStorageTaskProvider {
  constructor(
    private readonly image: ImageProvider,
    private readonly _post: PostRepository,
    private readonly _user: UserRepository,
    private readonly _organization: OrganizationRepository
  ) {}

  private get(keys: string[], kind: string): Promise<string[]> {
    const query = { image: { $in: keys } }

    switch (kind) {
      case ImageKind.POST:
        return this._post.distinct('image', query)
      case ImageKind.USER:
        return this._user.distinct('image', query)
      case ImageKind.ORGANIZATION:
        return this._organization.distinct('image', query)
      default:
        return Promise.resolve([])
    }
  }

  @Cron(CronExpression.EVERY_WEEK, { name: 'clean storage' })
  async run() {
    for await (const keys of this.image.list.run(new Date(Date.now() - DURATION))) {
      const by = group<string>(keys, (e) => first(split(e, '/')))

      const list = await Promise.all(map(by, (list, kind) => this.get(list, kind)))

      await this.image.remove.run(difference(keys, list.flat()))
    }
  }
}
