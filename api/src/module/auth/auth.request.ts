import { Transform } from 'class-transformer'
import { IsNumberString, IsPhoneNumber, Length } from 'class-validator'

import { format } from '@/helper/phone'

export class AuthRequest {
  @IsPhoneNumber('BR')
  @Transform(({ value }) => format(value))
  readonly phone!: string
}

export class VerifyRequest {
  @IsPhoneNumber('BR')
  @Transform(({ value }) => format(value))
  readonly phone!: string

  @IsNumberString({ no_symbols: true })
  @Length(6, 6)
  readonly code!: string
}
