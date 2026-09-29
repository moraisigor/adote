import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested
} from 'class-validator'

export class GetUserParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class ListPostRequest {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page!: number

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly amount!: number

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
