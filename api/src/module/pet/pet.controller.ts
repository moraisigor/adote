import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import type { Session } from '@/type/token'

import { Current } from '@/decorator/current.decorator'

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
  list(@Query() request: ListPetRequest, @Current() session: Session): Promise<PetResponse[]> {
    const {
      user: { id }
    } = session

    return this.provider.list.run(request, id)
  }

  @Get(':id')
  get(@Param() param: GetPetParam, @Current() session: Session): Promise<PetResponse> {
    const { id } = param
    const {
      user: { id: user }
    } = session

    return this.provider.get.run(id, user)
  }

  @Post()
  create(@Body() request: CreatePetRequest, @Current() session: Session): Promise<PetResponse> {
    const {
      user: { id }
    } = session

    return this.provider.create.run(request, id)
  }

  @Put(':id')
  save(
    @Param() param: SavePetParam,
    @Body() request: SavePetRequest,
    @Current() session: Session
  ): Promise<PetResponse> {
    const { id } = param
    const {
      user: { id: user }
    } = session

    return this.provider.save.run(id, request, user)
  }

  @Delete(':id')
  remove(@Param() param: RemovePetParam, @Current() session: Session): Promise<RemovePetResponse> {
    const { id } = param
    const {
      user: { id: user }
    } = session

    return this.provider.remove.run(id, user)
  }
}
