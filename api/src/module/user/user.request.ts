import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  ValidateNested
} from 'class-validator'

import { PageRequest } from '@/helper/page'

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
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly name!: string

  @Type(() => ContactRequest)
  @ValidateNested()
  readonly contact!: ContactRequest

  @IsMongoId({ message: 'the id is not valid' })
  @IsOptional()
  readonly location?: string
}

export class SaveImageRequest {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly image!: string
}
