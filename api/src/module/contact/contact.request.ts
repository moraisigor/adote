import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator'

import { format } from '@/helper/phone'

export class ContactRequest {
  @IsEmail()
  @IsOptional()
  readonly mail?: string

  @IsPhoneNumber('BR')
  @IsOptional()
  @Transform(({ value }) => format(value))
  readonly phone?: string

  @IsUrl()
  @IsOptional()
  readonly social?: string
}
