import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import type { HydratedDocument } from 'mongoose'

import { Kind } from '../type/kind'

export type BreedDocument = HydratedDocument<Breed>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Breed'
})
export class Breed {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: String, enum: Kind, required: true })
  kind!: Kind
}

export const BreedSchema = SchemaFactory.createForClass(Breed)
