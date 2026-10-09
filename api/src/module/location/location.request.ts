import { Transform, type TransformFnParams } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class SearchLocationRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly search!: string
}
