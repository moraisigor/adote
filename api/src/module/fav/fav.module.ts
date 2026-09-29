import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { User, UserSchema } from '@/module/user/repository/user.schema'

import { FavController } from './fav.controller'
import { FavProvider } from './provider'
import { AddFavProvider } from './provider/add.fav.provider'
import { RemoveFavProvider } from './provider/remove.fav.provider'
import { FavRepository } from './repository/fav.repository'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [FavProvider, AddFavProvider, RemoveFavProvider, FavRepository],
  controllers: [FavController]
})
export class FavModule {}
