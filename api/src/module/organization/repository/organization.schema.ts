import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Types, type HydratedDocument } from 'mongoose'

import { Member } from './member'

export type OrganizationDocument = HydratedDocument<Organization>

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
  collection: 'Organization'
})
export class Organization {
  @Prop({ type: String, unique: true, required: true })
  name!: string

  @Prop({ type: String })
  image?: string

  @Prop({ type: String, unique: true, sparse: true })
  document?: string

  @Prop({ type: Contact })
  contact?: Contact

  @Prop({ type: [Member], required: true })
  member!: Member[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Pet' }], default: [] })
  pet?: Types.ObjectId[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }], default: [] })
  post?: Types.ObjectId[]

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location?: Types.ObjectId
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization)

OrganizationSchema.index({ 'member.user': 1 })
