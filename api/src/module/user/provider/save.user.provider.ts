import { Injectable, NotFoundException } from '@nestjs/common'

import { Types } from 'mongoose'

import { UserRepository } from '../repository/user.repository'
import { SaveUserRequest } from '../user.request'
import { CurrentUserResponse } from '../user.response'

@Injectable()
export class SaveUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, request: SaveUserRequest): Promise<CurrentUserResponse> {
    const { name, contact, location } = request

    const map: { [key: string]: unknown } = {
      'name': name,
      'contact.mail': contact?.mail,
      'contact.phone': contact?.phone,
      'contact.social': contact?.social,
      'location': location && new Types.ObjectId(location)
    }

    const user = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (user) {
      return new CurrentUserResponse(user)
    }

    throw new NotFoundException()
  }
}
