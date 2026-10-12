import { Module } from '@nestjs/common'

import { PostModule } from '@/module/post/post.module'

import { FavController } from './fav.controller'
import { FavProvider } from './provider'
import { AddFavProvider } from './provider/add.fav.provider'
import { RemoveFavProvider } from './provider/remove.fav.provider'
import { FavRepository } from './repository/fav.repository'

@Module({
  imports: [PostModule],
  providers: [FavProvider, AddFavProvider, RemoveFavProvider, FavRepository],
  controllers: [FavController]
})
export class FavModule {}
