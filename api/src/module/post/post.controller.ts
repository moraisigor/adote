import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'
import { Public } from '@/decorator/public.decorator'

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
  create(@Body() request: CreatePostRequest, @Current() session: Session): Promise<PostResponse> {
    const {
      user: { id }
    } = session

    return this.provider.create.run(request, id)
  }

  @Put(':id')
  save(
    @Param() param: SavePostParam,
    @Body() request: SavePostRequest,
    @Current() session: Session
  ): Promise<PostResponse> {
    const { id } = param
    const {
      user: { id: user }
    } = session

    return this.provider.save.run(id, request, user)
  }

  @Put(':id/publish')
  publish(
    @Param() param: PublishPostParam,
    @Body() request: PublishPostRequest,
    @Current() session: Session
  ): Promise<PublishPostResponse> {
    const { id } = param
    const { publish } = request
    const {
      user: { id: user }
    } = session

    return this.provider.publish.run(id, publish, user)
  }

  @Delete(':id')
  remove(@Param() param: RemovePostParam, @Current() session: Session): Promise<RemovePostResponse> {
    const { id } = param
    const {
      user: { id: user }
    } = session

    return this.provider.remove.run(id, user)
  }
}
