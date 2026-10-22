import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ImageModule } from '@/module/image/image.module'

import { OrganizationController } from './organization.controller'
import { OrganizationProvider } from './provider'
import { CreateOrganizationProvider } from './provider/create.organization.provider'
import { GetOrganizationProvider } from './provider/get.organization.provider'
import { ListOrganizationProvider } from './provider/list.organization.provider'
import { RemoveOrganizationProvider } from './provider/remove.organization.provider'
import { SaveImageProvider } from './provider/save.image.provider'
import { SaveOrganizationProvider } from './provider/save.organization.provider'
import { OrganizationRepository } from './repository/organization.repository'
import { Organization, OrganizationSchema } from './repository/organization.schema'

@Module({
  imports: [
    ImageModule,
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])
  ],
  exports: [OrganizationRepository],
  providers: [
    CreateOrganizationProvider,
    GetOrganizationProvider,
    ListOrganizationProvider,
    OrganizationProvider,
    OrganizationRepository,
    RemoveOrganizationProvider,
    SaveImageProvider,
    SaveOrganizationProvider
  ],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
