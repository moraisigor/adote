import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { UserEvent } from '@/module/user/user.event'

import { RemoveOrganizationProvider } from '../provider/remove.organization.provider'
import { OrganizationRepository } from '../repository/organization.repository'
import { OrganizationRole } from '../type/organization.role'

@Injectable()
export class RemoveOrganizationListener {
  constructor(
    private readonly remove: RemoveOrganizationProvider,
    private readonly repository: OrganizationRepository
  ) {}

  @OnEvent(UserEvent.REMOVE, { suppressErrors: false })
  async user(user: string) {
    const organization = await this.repository.distinct('_id', {
      member: {
        $elemMatch: {
          user,
          role: OrganizationRole.MANAGER
        }
      },
      $nor: [
        {
          member: {
            $elemMatch: {
              user: {
                $ne: user
              },
              role: OrganizationRole.MANAGER
            }
          }
        }
      ]
    })

    for (const id of organization) {
      await this.remove.run(String(id))
    }

    await this.repository.update({ 'member.user': user }, { $pull: { member: { user } } })
  }
}
