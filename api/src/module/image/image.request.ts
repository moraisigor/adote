import { Type } from 'class-transformer'
import { IsIn, IsInt, Max, Min } from 'class-validator'

import { IMAGE_SIZE, ImageExtension, ImageKind } from './type/image'

export class SaveImageRequest {
  @IsIn(Object.values(ImageKind), { message: 'the kind is not valid' })
  readonly kind!: ImageKind

  @IsInt()
  @Min(1)
  @Max(IMAGE_SIZE)
  @Type(() => Number)
  readonly size!: number

  @IsIn(Object.keys(ImageExtension), { message: 'the extension is not valid' })
  readonly extension!: ImageExtension
}
