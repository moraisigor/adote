import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested
} from 'class-validator'

export class GetOrganizationParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class SaveOrganizationParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class RemoveOrganizationParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class ContactRequest {
  @IsEmail()
  @IsOptional()
  readonly mail?: string

  @IsPhoneNumber('BR')
  @IsOptional()
  readonly phone?: string

  @IsUrl()
  @IsOptional()
  readonly social?: string
}

export class CreateOrganizationRequest {
  @IsString()
  @Length(4, 40)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly name!: string
}

export class SaveOrganizationRequest {
  @IsString()
  @Length(4, 40)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly name!: string

  @IsNumberString({ no_symbols: true })
  @IsOptional()
  @Length(14, 14)
  readonly document?: string

  @IsOptional()
  @Type(() => ContactRequest)
  @ValidateNested()
  readonly contact?: ContactRequest
}
