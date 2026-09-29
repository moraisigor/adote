import { Injectable } from '@nestjs/common'

import { CreateOrganizationProvider } from './create.organization.provider'
import { GetOrganizationProvider } from './get.organization.provider'
import { ListOrganizationProvider } from './list.organization.provider'
import { RemoveOrganizationProvider } from './remove.organization.provider'
import { SaveOrganizationProvider } from './save.organization.provider'

@Injectable()
export class OrganizationProvider {
  constructor(
    readonly get: GetOrganizationProvider,
    readonly list: ListOrganizationProvider,
    readonly create: CreateOrganizationProvider,
    readonly save: SaveOrganizationProvider,
    readonly remove: RemoveOrganizationProvider
  ) {}
}
