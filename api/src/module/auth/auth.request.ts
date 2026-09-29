import { IsNumberString, IsPhoneNumber, Length } from 'class-validator'

export class AuthRequest {
  @IsPhoneNumber('BR')
  readonly phone!: string
}

export class VerifyRequest {
  @IsPhoneNumber('BR')
  readonly phone!: string

  @IsNumberString({ no_symbols: true })
  @Length(6, 6)
  readonly code!: string
}
