import { Module } from '@nestjs/common'

import { PostModule } from '@/module/post/post.module'
import { UserModule } from '@/module/user/user.module'

import { FavController } from './fav.controller'
import { RemoveFavListener } from './listener/remove.fav.listener'
import { FavProvider } from './provider'
import { AddFavProvider } from './provider/add.fav.provider'
import { ListFavProvider } from './provider/list.fav.provider'
import { RemoveFavProvider } from './provider/remove.fav.provider'

@Module({
  imports: [PostModule, UserModule],
  providers: [AddFavProvider, FavProvider, ListFavProvider, RemoveFavListener, RemoveFavProvider],
  controllers: [FavController]
})
export class FavModule {}
