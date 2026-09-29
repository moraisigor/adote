import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostController } from './post.controller'
import { PostProvider } from './provider'
import { CreatePostProvider } from './provider/create.post.provider'
import { GetPostProvider } from './provider/get.post.provider'
import { ListPostProvider } from './provider/list.post.provider'
import { PublishPostProvider } from './provider/publish.post.provider'
import { RemovePostProvider } from './provider/remove.post.provider'
import { SavePostProvider } from './provider/save.post.provider'
import { PostRepository } from './repository/post.repository'
import { Post, PostSchema } from './repository/post.schema'

import { PermissionModule } from '../permission/permission.module'
import { PetModule } from '../pet/pet.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    PermissionModule,
    PetModule
  ],
  exports: [PostRepository],
  providers: [
    PostProvider,
    GetPostProvider,
    ListPostProvider,
    CreatePostProvider,
    SavePostProvider,
    PublishPostProvider,
    RemovePostProvider,
    PostRepository
  ],
  controllers: [PostController]
})
export class PostModule {}
