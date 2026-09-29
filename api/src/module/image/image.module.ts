import { Module } from '@nestjs/common'

import { ImageProvider } from './provider'
import { RemoveImageProvider } from './provider/remove.image.provider'
import { SaveImageProvider } from './provider/save.image.provider'

@Module({
  exports: [ImageProvider],
  providers: [ImageProvider, SaveImageProvider, RemoveImageProvider]
})
export class ImageModule {}
