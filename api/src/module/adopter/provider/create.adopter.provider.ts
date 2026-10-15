import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PostRepository } from '@/module/post/repository/post.repository'

import { object } from '@/helper/repository'

import { CreateAdopterRequest } from '../adopter.request'
import { AdopterRepository } from '../repository/adopter.repository'

@Injectable()
export class CreateAdopterProvider {
  constructor(
    private readonly _post: PostRepository,
    private readonly repository: AdopterRepository
  ) {}

  async run(request: CreateAdopterRequest): Promise<void> {
    const { name, phone, pet } = request

    const post = await this._post.find({ pet, publish: true })

    if (isNil(post)) {
      throw new BadRequestException()
    }

    const { user, organization } = post

    await this.repository.save({
      name,
      phone,
      pet: new Types.ObjectId(pet),
      user: object(user),
      organization: object(organization)
    })
  }
}
