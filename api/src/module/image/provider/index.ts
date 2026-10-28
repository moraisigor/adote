import { Injectable } from '@nestjs/common'

import { ListImageProvider } from './list.image.provider'
import { RemoveImageProvider } from './remove.image.provider'
import { SaveImageProvider } from './save.image.provider'
import { ValidateImageProvider } from './validate.image.provider'

@Injectable()
export class ImageProvider {
  constructor(
    readonly list: ListImageProvider,
    readonly save: SaveImageProvider,
    readonly remove: RemoveImageProvider,
    readonly validate: ValidateImageProvider
  ) {}
}
