import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { SchemaTypes, type HydratedDocument, type MergeType, type Types } from 'mongoose'

import type { PetDocument } from '@/module/pet/repository/pet.schema'

export type AdopterDocument = HydratedDocument<Adopter>

export type AdopterView = MergeType<
  AdopterDocument,
  {
    pet: Pick<PetDocument, 'id' | 'name'>
  }
>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Adopter'
})
export class Adopter {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String, required: true })
  phone!: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Pet', required: true })
  pet!: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user?: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization?: Types.ObjectId
}

export const AdopterSchema = SchemaFactory.createForClass(Adopter)

AdopterSchema.index({ pet: 1, phone: 1 }, { unique: true })

AdopterSchema.index({ user: 1, create: 1 })

AdopterSchema.index({ organization: 1, create: 1 })
