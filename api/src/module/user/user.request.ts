import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  IsEmail,
  IsMongoId,
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

export class GetUserParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class ListUserRequest extends PageRequest {}

export class ListPostRequest extends PageRequest {
  @IsMongoId({ message: 'the organization is not valid' })
  @IsOptional()
  readonly organization?: string
}

class ContactRequest {
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

export class SaveUserRequest {
  @IsString()
  @Length(2, 20)
  @Transform(({ value }: TransformFnParams) => trim(value))
  readonly name!: string

  @IsOptional()
  @Type(() => ContactRequest)
  @ValidateNested()
  readonly contact?: ContactRequest

  @IsMongoId({ message: 'the id is not valid' })
  @IsOptional()
  readonly location?: string
}

export class SaveImageRequest {
  @IsString()
  @Matches(IMAGE_PATTERN)
  readonly image!: string
}
