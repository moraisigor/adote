import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { isNil } from 'lodash-es'

import { UserRepository } from '@/module/user/repository/user.repository'
import type { UserView } from '@/module/user/repository/user.schema'
import { Role } from '@/module/user/type/role'

import { format } from '@/helper/phone'

@Injectable()
export class SetManagerProvider {
  private readonly logger = new Logger(SetManagerProvider.name)

  constructor(
    private readonly config: ConfigService,
    private readonly repository: UserRepository
  ) {}

  async run(): Promise<UserView> {
    const phone = this.config.getOrThrow<string>('MANAGER_ACCOUNT')

    const result = await this.repository.save(
      { phone: format(phone) },
      {
        $set: {
          name: 'Oreo',
          role: Role.MANAGER
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    if (isNil(result)) {
      throw new BadRequestException()
    }

    return result
  }
}
