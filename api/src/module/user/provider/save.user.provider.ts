import { BadRequestException, Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { UserRepository } from '../repository/user.repository'
import { SaveUserRequest } from '../user.request'
import { UserResponse } from '../user.response'

@Injectable()
export class SaveUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, request: SaveUserRequest): Promise<UserResponse> {
    const { name, contact, location } = request

    const map: { [key: string]: unknown } = {
      'name': name,
      'contact.mail': contact.mail,
      'contact.phone': contact.phone,
      'contact.social': contact.social,
      'location': new Types.ObjectId(location)
    }

    const user = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (user) {
      return new UserResponse(user)
    }

    throw new BadRequestException()
  }
}
