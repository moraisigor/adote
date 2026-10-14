import { Injectable } from '@nestjs/common'

import { RemoveImageProvider } from './remove.image.provider'
import { SaveImageProvider } from './save.image.provider'
import { ValidateImageProvider } from './validate.image.provider'

@Injectable()
export class ImageProvider {
  constructor(
    readonly save: SaveImageProvider,
    readonly remove: RemoveImageProvider,
    readonly validate: ValidateImageProvider
  ) {}
}
