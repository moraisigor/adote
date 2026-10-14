import { Transform } from 'class-transformer'
import { IsMongoId, IsPhoneNumber, IsString, Length } from 'class-validator'

import { PageRequest } from '@/helper/page'
import { format } from '@/helper/phone'

export class ListAdopterRequest extends PageRequest {}

export class CreateAdopterRequest {
  @IsString()
  @Length(2, 40)
  @Transform(({ value }) => String(value).trim())
  readonly name!: string

  @IsPhoneNumber('BR')
  @Transform(({ value }) => format(value))
  readonly phone!: string

  @IsMongoId({ message: 'the pet is not valid' })
  readonly pet!: string
}
