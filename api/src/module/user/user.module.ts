import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ImageModule } from '@/module/image/image.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PermissionModule } from '@/module/permission/permission.module'
import { PostModule } from '@/module/post/post.module'

import { UserProvider } from './provider'
import { GetCurrentProvider } from './provider/get.current.provider'
import { GetUserProvider } from './provider/get.user.provider'
import { ListOrganizationProvider } from './provider/list.organization.provider'
import { ListPostProvider } from './provider/list.post.provider'
import { ListUserProvider } from './provider/list.user.provider'
import { RemoveUserProvider } from './provider/remove.user.provider'
import { SaveImageProvider } from './provider/save.image.provider'
import { SaveUserProvider } from './provider/save.user.provider'
import { UserRepository } from './repository/user.repository'
import { User, UserSchema } from './repository/user.schema'
import { UserController } from './user.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ImageModule,
    OrganizationModule,
    PermissionModule,
    PostModule
  ],
  exports: [UserRepository, MongooseModule],
  providers: [
    GetCurrentProvider,
    GetUserProvider,
    ListOrganizationProvider,
    ListPostProvider,
    ListUserProvider,
    RemoveUserProvider,
    SaveImageProvider,
    SaveUserProvider,
    UserProvider,
    UserRepository
  ],
  controllers: [UserController]
})
export class UserModule {}
