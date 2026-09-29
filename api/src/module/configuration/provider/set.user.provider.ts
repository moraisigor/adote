import { Injectable } from '@nestjs/common'

import { UserRepository } from '@/module/user/repository/user.repository'
import { Role } from '@/module/user/type/role'
import { UserResponse } from '@/module/user/user.response'

import user from '../user.json'

@Injectable()
export class SetUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(): Promise<UserResponse> {
    await this.repository.remove()

    const { key, name, phone } = user

    const result = await this.repository.create({
      key,
      name,
      phone,
      role: Role.MANAGER
    })

    return new UserResponse(result)
  }
}
