import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrganizationController } from './organization.controller'
import { OrganizationProvider } from './provider'
import { CreateOrganizationProvider } from './provider/create.organization.provider'
import { GetOrganizationProvider } from './provider/get.organization.provider'
import { ListOrganizationProvider } from './provider/list.organization.provider'
import { RemoveOrganizationProvider } from './provider/remove.organization.provider'
import { SaveOrganizationProvider } from './provider/save.organization.provider'
import { OrganizationRepository } from './repository/organization.repository'
import { Organization, OrganizationSchema } from './repository/organization.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])],
  exports: [OrganizationRepository],
  providers: [
    OrganizationProvider,
    GetOrganizationProvider,
    ListOrganizationProvider,
    CreateOrganizationProvider,
    SaveOrganizationProvider,
    RemoveOrganizationProvider,
    OrganizationRepository
  ],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
