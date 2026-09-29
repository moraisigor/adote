import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Types, type HydratedDocument } from 'mongoose'

import type { LocationDocument } from '@/module/location/repository/location.schema'
import { Post } from '@/module/post/repository/post.schema'

import { Role } from '../type/role'

export type UserDocument = HydratedDocument<User>

@Schema({ _id: false })
export class Contact {
  @Prop({ type: String })
  mail?: string

  @Prop({ type: String })
  phone?: string

  @Prop({ type: String })
  social?: string
}

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'User'
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  key!: string

  @Prop({ type: String, unique: true, required: true })
  phone!: string

  @Prop({ type: String })
  name?: string

  @Prop({ type: String })
  image?: string

  @Prop({ type: Contact })
  contact?: Contact

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }], default: [] })
  fav?: Post[] = []

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location?: LocationDocument

  @Prop({ type: String, enum: Role, required: true, default: Role.MEMBER })
  role: Role = Role.MEMBER

  @Prop({ type: Boolean, required: true, default: true })
  enable: boolean = true
}

export const UserSchema = SchemaFactory.createForClass(User)
