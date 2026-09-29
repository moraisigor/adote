import { Transform, Type, type TransformFnParams } from 'class-transformer'
import {
  isArray,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator'

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

export class ListPostRequest {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page!: number

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly amount!: number

  @IsArray()
  @IsMongoId({ each: true, message: 'the location is not valid' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    if (isArray(value)) {
      return value
    }

    return [value]
  })
  readonly location?: string[]

  @IsMongoId({ message: 'the organization is not valid' })
  @IsOptional()
  readonly organization?: string
}

export class CreatePostRequest {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
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
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
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
