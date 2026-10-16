import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { SchemaTypes, type HydratedDocument, type MergeType, type Types } from 'mongoose'

import type { LocationDocument } from '@/module/location/repository/location.schema'

import { unique } from '@/helper/id'

import { Role } from '../type/role'

export type UserDocument = HydratedDocument<User>

export type UserView = MergeType<
  UserDocument,
  {
    location?: Pick<LocationDocument, 'id' | 'city' | 'state'>
  }
>

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
  phone!: string

  @Prop({ type: String })
  name?: string

  @Prop({ type: String })
  image?: string

  @Prop({ type: Contact })
  contact?: Contact

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Post' }], default: [] })
  fav!: Types.ObjectId[]

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Location' })
  location?: Types.ObjectId

  @Prop({ type: String, enum: Role, required: true, default: Role.MEMBER })
  role!: Role

  @Prop({ type: Boolean, required: true, default: true })
  enable!: boolean

  @Prop({ type: String, required: true, default: () => unique(40) })
  session!: string
}

export const UserSchema = SchemaFactory.createForClass(User)
