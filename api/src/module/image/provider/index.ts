import { Injectable } from '@nestjs/common'

import { RemoveImageProvider } from './remove.image.provider'
import { SaveImageProvider } from './save.image.provider'

@Injectable()
export class ImageProvider {
  constructor(
    readonly save: SaveImageProvider,
    readonly remove: RemoveImageProvider
  ) {}
}
