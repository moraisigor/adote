import { ForbiddenException, Injectable } from '@nestjs/common'

import { Types, type QueryFilter } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { ListAdopterRequest } from '../adopter.request'
import { AdopterResponse } from '../adopter.response'
import { AdopterRepository } from '../repository/adopter.repository'
import type { Adopter } from '../repository/adopter.schema'

@Injectable()
export class ListAdopterProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: AdopterRepository
  ) {}

  private async list(request: ListAdopterRequest, query: QueryFilter<Adopter>): Promise<AdopterResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, query)

    return list.map((e) => new AdopterResponse(e))
  }

  async run(request: ListAdopterRequest, current: string): Promise<AdopterResponse[]> {
    const { organization } = request

    if (organization) {
      const permission = await this.permission.organization.run(current, organization)

      if (!permission) {
        throw new ForbiddenException()
      }

      return await this.list(request, {
        organization: new Types.ObjectId(organization)
      })
    }

    return await this.list(request, {
      user: new Types.ObjectId(current)
    })
  }
}
