import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  IsEmail,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateNested
} from 'class-validator'

import { IMAGE_PATTERN } from '@/module/image/type/image'

import { PageRequest } from '@/helper/page'
import { trim } from '@/helper/string'

export class ListOrganizationRequest extends PageRequest {}

export class GetOrganizationParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class SaveOrganizationParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class SaveImageParam {
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
  @Transform(({ value }: TransformFnParams) => trim(value))
  readonly name!: string
}

export class SaveOrganizationRequest {
  @IsString()
  @Length(4, 40)
  @Transform(({ value }: TransformFnParams) => trim(value))
  readonly name!: string

  @IsNumberString({ no_symbols: true })
  @IsOptional()
  @Length(14, 14)
  readonly document?: string

  @IsOptional()
  @Type(() => ContactRequest)
  @ValidateNested()
  readonly contact?: ContactRequest

  @IsMongoId({ message: 'the location is not valid' })
  @IsOptional()
  readonly location?: string
}

export class SaveImageRequest {
  @IsString()
  @Matches(IMAGE_PATTERN)
  readonly image!: string
}
