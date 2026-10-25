import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { SchemaTypes, type HydratedDocument, type MergeType, type Types } from 'mongoose'

import type { LocationDocument } from '@/module/location/repository/location.schema'
import type { OrganizationDocument } from '@/module/organization/repository/organization.schema'
import type { PetView } from '@/module/pet/repository/pet.schema'
import type { UserDocument } from '@/module/user/repository/user.schema'

export type PostDocument = HydratedDocument<Post>

export type PostView = MergeType<
  PostDocument,
  {
    pet: Pick<PetView, 'id' | 'name' | 'size' | 'gender' | 'breed'>
    location: Pick<LocationDocument, 'id' | 'city' | 'state'>
    user?: Pick<UserDocument, 'id' | 'name' | 'image' | 'contact'>
    organization?: Pick<OrganizationDocument, 'id' | 'name' | 'image' | 'contact'>
  }
>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Post'
})
export class Post {
  @Prop({ type: [String], required: true })
  image!: string[]

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Pet', required: true })
  pet!: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Location' })
  location!: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user?: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization?: Types.ObjectId

  @Prop({ type: Boolean, required: true })
  publish!: boolean
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.index({ pet: 1 }, { unique: true })

PostSchema.index({ user: 1 })

// publish
PostSchema.index({ publish: 1, create: 1 })

PostSchema.index({ publish: 1, location: 1, create: 1 })

// organization
PostSchema.index({ organization: 1, publish: 1, create: 1 })
