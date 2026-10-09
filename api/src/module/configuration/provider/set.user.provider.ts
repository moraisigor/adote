import { Injectable } from '@nestjs/common'

import { UserRepository } from '@/module/user/repository/user.repository'
import { Role } from '@/module/user/type/role'
import { UserResponse } from '@/module/user/user.response'

import USER from '../user.json'

@Injectable()
export class SetUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(): Promise<UserResponse> {
    await this.repository.remove()

    const { name, phone } = USER

    const result = await this.repository.create({
      name,
      phone,
      role: Role.MANAGER
    })

    return new UserResponse(result)
  }
}
