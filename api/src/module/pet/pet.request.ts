import { Transform, type TransformFnParams } from 'class-transformer'
import { IsEnum, IsMongoId, IsOptional, IsString, Length } from 'class-validator'

import { Kind } from '@/module/breed/type/kind'

import { PageRequest } from '@/helper/page'
import { trim } from '@/helper/string'

import { Gender } from './type/gender'
import { Size } from './type/size'

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

export class ListPetRequest extends PageRequest {
  @IsMongoId({ message: 'the organization is not valid' })
  @IsOptional()
  readonly organization?: string
}

export class CreatePetRequest {
  @IsString()
  @Length(2, 20)
  @Transform(({ value }: TransformFnParams) => trim(value))
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
  @Transform(({ value }: TransformFnParams) => trim(value))
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
