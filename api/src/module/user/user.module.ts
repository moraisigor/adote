import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

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

import { ImageModule } from '../image/image.module'
import { OrganizationModule } from '../organization/organization.module'
import { PermissionModule } from '../permission/permission.module'
import { PostModule } from '../post/post.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ImageModule,
    OrganizationModule,
    PermissionModule,
    PostModule
  ],
  exports: [UserRepository],
  providers: [
    UserProvider,
    GetUserProvider,
    GetCurrentProvider,
    ListUserProvider,
    ListPostProvider,
    ListOrganizationProvider,
    SaveUserProvider,
    SaveImageProvider,
    RemoveUserProvider,
    UserRepository
  ],
  controllers: [UserController]
})
export class UserModule {}
