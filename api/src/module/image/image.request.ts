import { Type } from 'class-transformer'
import { IsIn, IsNumber, Max } from 'class-validator'

import { IMAGE_SIZE, ImageExtension, ImageKind } from './type/image'

export class SaveImageRequest {
  @IsNumber()
  @Type(() => Number)
  @Max(IMAGE_SIZE)
  readonly size!: number

  @IsIn(Object.values(ImageKind), { message: 'the kind is not valid' })
  readonly kind!: ImageKind

  @IsIn(Object.keys(ImageExtension), { message: 'the extension is not valid' })
  readonly extension!: ImageExtension
}
