import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Types, type HydratedDocument } from 'mongoose'

import type { LocationDocument } from '@/module/location/repository/location.schema'
import type { OrganizationDocument } from '@/module/organization/repository/organization.schema'
import type { PetDocument } from '@/module/pet/repository/pet.schema'
import type { UserDocument } from '@/module/user/repository/user.schema'

export type PostDocument = HydratedDocument<Post>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Post'
})
export class Post {
  @Prop({ type: [String], required: true })
  image!: string[]

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  pet!: Types.ObjectId | PetDocument

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location!: Types.ObjectId | LocationDocument

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: Types.ObjectId | UserDocument

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization?: Types.ObjectId | OrganizationDocument

  @Prop({ type: Boolean, required: true })
  publish!: boolean
}

export const PostSchema = SchemaFactory.createForClass(Post)
