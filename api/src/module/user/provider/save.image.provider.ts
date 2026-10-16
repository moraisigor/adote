import { BadRequestException, Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'

import { UserRepository } from '../repository/user.repository'
import { CurrentUserResponse } from '../user.response'

@Injectable()
export class SaveImageProvider {
  constructor(
    private readonly _image: ImageProvider,
    private readonly repository: UserRepository
  ) {}

  async run(id: string, image: string): Promise<CurrentUserResponse> {
    const valid = await this._image.validate.run([image], ImageKind.USER, id)

    if (valid) {
      const user = await this.repository.save(new Types.ObjectId(id), { image }, { returnDocument: 'after' })

      if (isNil(user)) {
        throw new BadRequestException()
      }

      return new CurrentUserResponse(user)
    }

    throw new BadRequestException()
  }
}
