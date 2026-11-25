import { Module } from '@nestjs/common'

import { ImageModule } from '@/module/image/image.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PetModule } from '@/module/pet/pet.module'
import { UserModule } from '@/module/user/user.module'

import { TaskProvider } from './provider'
import { CleanStorageTaskProvider } from './provider/clean.storage.task.provider'

@Module({
  imports: [ImageModule, OrganizationModule, PetModule, UserModule],
  exports: [TaskProvider],
  providers: [CleanStorageTaskProvider, TaskProvider]
})
export class TaskModule {}
