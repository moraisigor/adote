import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PermissionModule } from '@/module/permission/permission.module'
import { PostModule } from '@/module/post/post.module'

import { AdopterController } from './adopter.controller'
import { AdopterProvider } from './provider'
import { CreateAdopterProvider } from './provider/create.adopter.provider'
import { ListAdopterProvider } from './provider/list.adopter.provider'
import { AdopterRepository } from './repository/adopter.repository'
import { Adopter, AdopterSchema } from './repository/adopter.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Adopter.name, schema: AdopterSchema }]),
    PermissionModule,
    forwardRef(() => PostModule)
  ],
  exports: [AdopterRepository],
  providers: [AdopterProvider, AdopterRepository, CreateAdopterProvider, ListAdopterProvider],
  controllers: [AdopterController]
})
export class AdopterModule {}
