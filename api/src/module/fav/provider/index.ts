import { Injectable } from '@nestjs/common'

import { AddFavProvider } from './add.fav.provider'
import { RemoveFavProvider } from './remove.fav.provider'

@Injectable()
export class FavProvider {
  constructor(
    readonly add: AddFavProvider,
    readonly remove: RemoveFavProvider
  ) {}
}
