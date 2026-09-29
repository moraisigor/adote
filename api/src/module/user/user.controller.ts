import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common'

import type { User } from '@/type/token'

import { Permission } from '@/decorator/permission.decorator'
import { Public } from '@/decorator/public.decorator'
import { UserCurrent } from '@/decorator/user.current.decorator'

import { UserProvider } from './provider'
import { Role } from './type/role'
import { GetUserParam, ListPostRequest, SaveImageRequest, SaveUserRequest } from './user.request'
import { RemoveUserResponse, UserCurrentResponse, UserResponse } from './user.response'

import type { OrganizationResponse } from '../organization/organization.response'
import type { PostResponse } from '../post/post.response'

@Controller()
export class UserController {
  constructor(private readonly provider: UserProvider) {}

  @Get()
  @Permission([Role.MANAGER])
  list(): Promise<UserResponse[]> {
    return this.provider.list.run()
  }

  @Get('current')
  current(@UserCurrent() user: User): Promise<UserCurrentResponse> {
    const { id: current } = user

    return this.provider.current.run(current)
  }

  @Get('post')
  post(@Query() request: ListPostRequest, @UserCurrent() user: User): Promise<PostResponse[]> {
    const { id: current } = user

    return this.provider.post.run(request, current)
  }

  @Get('organization')
  organization(@UserCurrent() user: User): Promise<OrganizationResponse[]> {
    const { id: current } = user

    return this.provider.organization.run(current)
  }

  @Get(':id')
  @Public()
  get(@Param() param: GetUserParam): Promise<UserResponse> {
    const { id } = param

    return this.provider.get.run(id)
  }

  @Put()
  save(@Body() request: SaveUserRequest, @UserCurrent() user: User): Promise<UserResponse> {
    const { id: current } = user

    return this.provider.save.run(current, request)
  }

  @Put('image')
  image(@Body() request: SaveImageRequest, @UserCurrent() user: User): Promise<UserResponse> {
    const { image } = request
    const { id: current } = user

    return this.provider.image.run(current, image)
  }

  @Delete()
  remove(@UserCurrent() user: User): Promise<RemoveUserResponse> {
    const { id: current } = user

    return this.provider.remove.run(current)
  }
}
