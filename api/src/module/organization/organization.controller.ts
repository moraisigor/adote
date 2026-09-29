import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'

import type { User } from '@/type/token'

import { OrganizationPermission } from '@/decorator/organization.permission.decorator'
import { Permission } from '@/decorator/permission.decorator'
import { Public } from '@/decorator/public.decorator'
import { UserCurrent } from '@/decorator/user.current.decorator'

import { Role } from '@/module/user/type/role'

import {
  CreateOrganizationRequest,
  GetOrganizationParam,
  RemoveOrganizationParam,
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
  list(): Promise<OrganizationResponse[]> {
    return this.provider.list.run()
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
    @UserCurrent() user: User
  ): Promise<OrganizationResponse> {
    const { id: current } = user

    return this.provider.create.run(request, current)
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

  @Delete(':id')
  @OrganizationPermission([OrganizationRole.MANAGER])
  remove(@Param() param: RemoveOrganizationParam): Promise<RemoveOrganizationResponse> {
    const { id } = param

    return this.provider.remove.run(id)
  }
}
