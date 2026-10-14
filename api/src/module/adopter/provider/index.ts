import { Injectable } from '@nestjs/common'

import { CreateAdopterProvider } from './create.adopter.provider'
import { ListAdopterProvider } from './list.adopter.provider'

@Injectable()
export class AdopterProvider {
  constructor(
    readonly list: ListAdopterProvider,
    readonly create: CreateAdopterProvider
  ) {}
}
