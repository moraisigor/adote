import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  isArray,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
  Matches
} from 'class-validator'

import { IMAGE_PATTERN } from '@/module/image/type/image'

import { PageRequest } from '@/helper/page'

export class GetPostParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class SavePostParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class PublishPostParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class RemovePostParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class ListPostRequest extends PageRequest {
  @IsArray()
  @IsMongoId({ each: true, message: 'the location is not valid' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    if (isArray(value)) {
      return value as string[]
    }

    return [value] as string[]
  })
  readonly location?: string[]

  @IsMongoId({ message: 'the organization is not valid' })
  @IsOptional()
  readonly organization?: string
}

export class CreatePostRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Matches(IMAGE_PATTERN, { each: true })
  readonly image!: string[]

  @IsMongoId({ message: 'the pet is not valid' })
  readonly pet!: string

  @IsMongoId({ message: 'the location is not valid' })
  readonly location!: string

  @IsBoolean()
  @Type(() => Boolean)
  readonly publish!: boolean
}

export class SavePostRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Matches(IMAGE_PATTERN, { each: true })
  readonly image!: string[]

  @IsMongoId({ message: 'the location is not valid' })
  readonly location!: string

  @IsBoolean()
  @Type(() => Boolean)
  readonly publish!: boolean
}

export class PublishPostRequest {
  @IsBoolean()
  @Type(() => Boolean)
  readonly publish!: boolean
}
