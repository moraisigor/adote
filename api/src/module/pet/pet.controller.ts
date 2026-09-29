import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import type { User } from '@/type/token'

import { UserCurrent } from '@/decorator/user.current.decorator'

import {
  CreatePetRequest,
  GetPetParam,
  ListPetRequest,
  RemovePetParam,
  SavePetParam,
  SavePetRequest
} from './pet.request'
import type { PetResponse, RemovePetResponse } from './pet.response'
import { PetProvider } from './provider'

@Controller('pet')
export class PetController {
  constructor(private readonly provider: PetProvider) {}

  @Get()
  list(@Query() request: ListPetRequest, @UserCurrent() user: User): Promise<PetResponse[]> {
    const { id: current } = user

    return this.provider.list.run(request, current)
  }

  @Get(':id')
  get(@Param() param: GetPetParam, @UserCurrent() user: User): Promise<PetResponse> {
    const { id } = param
    const { id: current } = user

    return this.provider.get.run(id, current)
  }

  @Post()
  create(@Body() request: CreatePetRequest, @UserCurrent() user: User): Promise<PetResponse> {
    const { id: current } = user

    return this.provider.create.run(request, current)
  }

  @Put(':id')
  save(
    @Param() param: SavePetParam,
    @Body() request: SavePetRequest,
    @UserCurrent() user: User
  ): Promise<PetResponse> {
    const { id } = param
    const { id: current } = user

    return this.provider.save.run(id, request, current)
  }

  @Delete(':id')
  remove(@Param() param: RemovePetParam, @UserCurrent() user: User): Promise<RemovePetResponse> {
    const { id } = param
    const { id: current } = user

    return this.provider.remove.run(id, current)
  }
}
