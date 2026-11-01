import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { SchemaTypes, type HydratedDocument, type Types } from 'mongoose'

import { Contact } from '@/module/contact/contact.schema'

import { Member } from './member'

export type OrganizationDocument = HydratedDocument<Organization>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Organization'
})
export class Organization {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String })
  image?: string

  @Prop({ type: String })
  document?: string

  @Prop({ type: Contact })
  contact?: Contact

  @Prop({ type: [Member], required: true })
  member!: Member[]

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Location' })
  location?: Types.ObjectId
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization)

OrganizationSchema.index({ name: 1 }, { unique: true })

OrganizationSchema.index({ document: 1 }, { unique: true, sparse: true })

OrganizationSchema.index({ image: 1 }, { sparse: true })

OrganizationSchema.index({ 'member.user': 1, '_id': 1 })
