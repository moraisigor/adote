import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash-es'
import { Types } from 'mongoose'

import { PetRepository } from '@/module/pet/repository/pet.repository'
import { State } from '@/module/pet/type/state'

import { id, object } from '@/helper/repository'

import { CreateAdopterRequest } from '../adopter.request'
import { AdopterRepository } from '../repository/adopter.repository'

@Injectable()
export class CreateAdopterProvider {
  constructor(
    private readonly _pet: PetRepository,
    private readonly repository: AdopterRepository
  ) {}

  async run(request: CreateAdopterRequest): Promise<void> {
    const { name, phone, pet } = request

    const find = await this._pet.find({ _id: pet, state: State.PUBLIC }, 'user organization', {
      populate: []
    })

    if (isNil(find)) {
      throw new BadRequestException()
    }

    const { user, organization } = find

    await this.repository.save({
      name,
      phone,
      pet: new Types.ObjectId(pet),
      user: object(id(user)),
      organization: object(id(organization))
    })
  }
}
