import { IsMongoId } from 'class-validator'

import { PageRequest } from '@/helper/page'

export class AddFavParam {
  @IsMongoId({ message: 'the post is not valid' })
  readonly post!: string
}

export class RemoveFavParam {
  @IsMongoId({ message: 'the post is not valid' })
  readonly post!: string
}

export class ListFavRequest extends PageRequest {}
