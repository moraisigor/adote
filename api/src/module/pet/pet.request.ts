import { Transform, Type, type TransformFnParams } from 'class-transformer'
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator'

import { Gender } from './type/gender'
import { Size } from './type/size'

import { Kind } from '../breed/type/kind'

export class GetPetParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class SavePetParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class RemovePetParam {
  @IsMongoId({ message: 'the id is not valid' })
  readonly id!: string
}

export class ListPetRequest {
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

export class CreatePetRequest {
  @IsString()
  @Length(2, 20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly name!: string

  @IsEnum(Kind)
  readonly kind!: Kind

  @IsEnum(Size)
  readonly size!: Size

  @IsEnum(Gender)
  readonly gender!: Gender

  @IsMongoId({ message: 'the breed is not valid' })
  readonly breed!: string

  @IsMongoId({ message: 'the organization is not valid' })
  @IsOptional()
  readonly organization?: string
}

export class SavePetRequest {
  @IsString()
  @Length(2, 20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly name!: string

  @IsEnum(Kind)
  readonly kind!: Kind

  @IsEnum(Size)
  readonly size!: Size

  @IsEnum(Gender)
  readonly gender!: Gender

  @IsMongoId({ message: 'the breed is not valid' })
  readonly breed!: string
}
