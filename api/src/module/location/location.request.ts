import { Transform, type TransformFnParams } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { trim } from 'lodash'

export class SearchLocationRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @Transform(({ value }: TransformFnParams) => trim(value))
  readonly search!: string
}
