import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { SchemaTypes, type HydratedDocument, type MergeType, type Types } from 'mongoose'

import type { BreedDocument } from '@/module/breed/repository/breed.schema'
import { Kind } from '@/module/breed/type/kind'

import { Gender } from '../type/gender'
import { Size } from '../type/size'

export type PetDocument = HydratedDocument<Pet>

export type PetView = MergeType<
  PetDocument,
  {
    breed: Pick<BreedDocument, 'id' | 'name'>
  }
>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Pet'
})
export class Pet {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String, enum: Kind, required: true })
  kind!: Kind

  @Prop({ type: String, enum: Size, required: true })
  size!: Size

  @Prop({ type: String, enum: Gender, required: true })
  gender!: Gender

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Breed', required: true })
  breed!: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user?: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization?: Types.ObjectId
}

export const PetSchema = SchemaFactory.createForClass(Pet)

PetSchema.index({ user: 1 })

PetSchema.index({ organization: 1 })
