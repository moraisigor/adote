import { IsEnum } from 'class-validator'

import { Kind } from './type/kind'

export class ListBreedRequest {
  @IsEnum(Kind)
  readonly kind!: Kind
}
