import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'
import { OrganizationPermission } from '@/decorator/organization.permission.decorator'
import { Permission } from '@/decorator/permission.decorator'
import { Public } from '@/decorator/public.decorator'

import { Role } from '@/module/user/type/role'

import {
  CreateOrganizationRequest,
  GetOrganizationParam,
  ListOrganizationRequest,
  RemoveOrganizationParam,
  SaveImageParam,
  SaveImageRequest,
  SaveOrganizationParam,
  SaveOrganizationRequest
} from './organization.request'
import { OrganizationResponse, RemoveOrganizationResponse } from './organization.response'
import { OrganizationProvider } from './provider'
import { OrganizationRole } from './type/organization.role'

@Controller('organization')
export class OrganizationController {
  constructor(private readonly provider: OrganizationProvider) {}

  @Get()
  @Permission([Role.MANAGER])
  list(@Query() request: ListOrganizationRequest): Promise<OrganizationResponse[]> {
    return this.provider.list.run(request)
  }

  @Get(':id')
  @Public()
  get(@Param() param: GetOrganizationParam): Promise<OrganizationResponse> {
    const { id } = param

    return this.provider.get.run(id)
  }

  @Post()
  create(
    @Body() request: CreateOrganizationRequest,
    @Current() session: Session
  ): Promise<OrganizationResponse> {
    const {
      user: { id }
    } = session

    return this.provider.create.run(request, id)
  }

  @Put(':id')
  @OrganizationPermission([OrganizationRole.MANAGER])
  save(
    @Param() param: SaveOrganizationParam,
    @Body() request: SaveOrganizationRequest
  ): Promise<OrganizationResponse> {
    const { id } = param

    return this.provider.save.run(id, request)
  }

  @Put(':id/image')
  @OrganizationPermission([OrganizationRole.MANAGER])
  image(
    @Param() param: SaveImageParam,
    @Body() request: SaveImageRequest,
    @Current() session: Session
  ): Promise<OrganizationResponse> {
    const { id } = param
    const { image } = request
    const {
      user: { id: user }
    } = session

    return this.provider.image.run(id, image, user)
  }

  @Delete(':id')
  @OrganizationPermission([OrganizationRole.MANAGER])
  remove(@Param() param: RemoveOrganizationParam): Promise<RemoveOrganizationResponse> {
    const { id } = param

    return this.provider.remove.run(id)
  }
}
