import { Module } from '@nestjs/common'

import { ImageController } from './image.controller'
import { ImageStorage } from './image.storage'
import { ImageProvider } from './provider'
import { ListImageProvider } from './provider/list.image.provider'
import { RemoveImageProvider } from './provider/remove.image.provider'
import { SaveImageProvider } from './provider/save.image.provider'
import { ValidateImageProvider } from './provider/validate.image.provider'

@Module({
  exports: [ImageProvider],
  providers: [
    ImageProvider,
    ImageStorage,
    ListImageProvider,
    RemoveImageProvider,
    SaveImageProvider,
    ValidateImageProvider
  ],
  controllers: [ImageController]
})
export class ImageModule {}
