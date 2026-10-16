import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'
import { Permission } from '@/decorator/permission.decorator'
import { Public } from '@/decorator/public.decorator'

import type { OrganizationResponse } from '@/module/organization/organization.response'
import type { PostResponse } from '@/module/post/post.response'

import { PageRequest } from '@/helper/page'

import { UserProvider } from './provider'
import { Role } from './type/role'
import {
  GetUserParam,
  ListPostRequest,
  ListUserRequest,
  SaveImageRequest,
  SaveUserRequest
} from './user.request'
import { CurrentUserResponse, RemoveUserResponse, UserResponse } from './user.response'

@Controller()
export class UserController {
  constructor(private readonly provider: UserProvider) {}

  @Get()
  @Permission([Role.MANAGER])
  list(@Query() request: ListUserRequest): Promise<CurrentUserResponse[]> {
    return this.provider.list.run(request)
  }

  @Get('current')
  current(@Current() session: Session): Promise<CurrentUserResponse> {
    const {
      user: { id }
    } = session

    return this.provider.current.run(id)
  }

  @Get('post')
  post(@Query() request: ListPostRequest, @Current() session: Session): Promise<PostResponse[]> {
    const {
      user: { id }
    } = session

    return this.provider.post.run(request, id)
  }

  @Get('organization')
  organization(@Query() request: PageRequest, @Current() session: Session): Promise<OrganizationResponse[]> {
    const {
      user: { id }
    } = session

    return this.provider.organization.run(request, id)
  }

  @Get(':id')
  @Public()
  get(@Param() param: GetUserParam): Promise<UserResponse> {
    const { id } = param

    return this.provider.get.run(id)
  }

  @Put()
  save(@Body() request: SaveUserRequest, @Current() session: Session): Promise<CurrentUserResponse> {
    const {
      user: { id }
    } = session

    return this.provider.save.run(id, request)
  }

  @Put('image')
  image(@Body() request: SaveImageRequest, @Current() session: Session): Promise<CurrentUserResponse> {
    const { image } = request
    const {
      user: { id }
    } = session

    return this.provider.image.run(id, image)
  }

  @Delete()
  remove(@Current() session: Session): Promise<RemoveUserResponse> {
    const {
      user: { id }
    } = session

    return this.provider.remove.run(id)
  }
}
