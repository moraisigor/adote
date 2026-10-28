import { Module } from '@nestjs/common'

import { ImageModule } from '@/module/image/image.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PostModule } from '@/module/post/post.module'
import { UserModule } from '@/module/user/user.module'

import { TaskProvider } from './provider'
import { CleanStorageTaskProvider } from './provider/clean.storage.task.provider'

@Module({
  imports: [ImageModule, OrganizationModule, PostModule, UserModule],
  exports: [TaskProvider],
  providers: [CleanStorageTaskProvider, TaskProvider]
})
export class TaskModule {}
