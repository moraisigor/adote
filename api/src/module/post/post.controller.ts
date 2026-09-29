import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import type { User } from '@/type/token'

import { Public } from '@/decorator/public.decorator'
import { UserCurrent } from '@/decorator/user.current.decorator'

import {
  CreatePostRequest,
  GetPostParam,
  ListPostRequest,
  PublishPostParam,
  PublishPostRequest,
  RemovePostParam,
  SavePostParam,
  SavePostRequest
} from './post.request'
import type { PostResponse, PublishPostResponse, RemovePostResponse } from './post.response'
import { PostProvider } from './provider'

@Controller('post')
export class PostController {
  constructor(private readonly provider: PostProvider) {}

  @Get()
  @Public()
  list(@Query() request: ListPostRequest): Promise<PostResponse[]> {
    return this.provider.list.run(request)
  }

  @Get(':id')
  @Public()
  get(@Param() param: GetPostParam): Promise<PostResponse> {
    const { id } = param

    return this.provider.get.run(id)
  }

  @Post()
  create(@Body() request: CreatePostRequest, @UserCurrent() user: User): Promise<PostResponse> {
    const { id: current } = user

    return this.provider.create.run(request, current)
  }

  @Put(':id')
  save(
    @Param() param: SavePostParam,
    @Body() request: SavePostRequest,
    @UserCurrent() user: User
  ): Promise<PostResponse> {
    const { id } = param
    const { id: current } = user

    return this.provider.save.run(id, request, current)
  }

  @Put(':id/publish')
  publish(
    @Param() param: PublishPostParam,
    @Body() request: PublishPostRequest,
    @UserCurrent() user: User
  ): Promise<PublishPostResponse> {
    const { id } = param
    const { publish } = request
    const { id: current } = user

    return this.provider.publish.run(id, publish, current)
  }

  @Delete(':id')
  remove(@Param() param: RemovePostParam, @UserCurrent() user: User): Promise<RemovePostResponse> {
    const { id } = param
    const { id: current } = user

    return this.provider.remove.run(id, current)
  }
}
