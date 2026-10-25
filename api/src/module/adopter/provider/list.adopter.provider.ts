import { Injectable } from '@nestjs/common'

import { PermissionProvider } from '@/module/permission/provider'

import { ListAdopterRequest } from '../adopter.request'
import { AdopterResponse } from '../adopter.response'
import { AdopterRepository } from '../repository/adopter.repository'

@Injectable()
export class ListAdopterProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: AdopterRepository
  ) {}

  async run(request: ListAdopterRequest, current: string): Promise<AdopterResponse[]> {
    const { page, amount, organization } = request

    const skip = (page - 1) * amount

    const scope = await this.permission.scope.run(current, organization)

    const list = await this.repository.list(skip, amount, scope)

    return list.map((e) => new AdopterResponse(e))
  }
}
