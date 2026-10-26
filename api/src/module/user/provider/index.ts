import { Injectable } from '@nestjs/common'

import { GetCurrentProvider } from './get.current.provider'
import { GetUserProvider } from './get.user.provider'
import { ListOrganizationUserProvider } from './list.organization.user.provider'
import { ListPostUserProvider } from './list.post.user.provider'
import { ListUserProvider } from './list.user.provider'
import { RemoveUserProvider } from './remove.user.provider'
import { SaveImageUserProvider } from './save.image.user.provider'
import { SaveUserProvider } from './save.user.provider'

@Injectable()
export class UserProvider {
  constructor(
    readonly get: GetUserProvider,
    readonly current: GetCurrentProvider,
    readonly list: ListUserProvider,
    readonly post: ListPostUserProvider,
    readonly organization: ListOrganizationUserProvider,
    readonly save: SaveUserProvider,
    readonly image: SaveImageUserProvider,
    readonly remove: RemoveUserProvider
  ) {}
}
