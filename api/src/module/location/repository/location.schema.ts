import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import type { HydratedDocument } from 'mongoose'

export type LocationDocument = HydratedDocument<Location>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Location'
})
export class Location {
  @Prop({ type: String, required: true })
  city!: string

  @Prop({ type: String, required: true })
  state!: string

  @Prop({ type: String, required: true })
  search!: string
}

export const LocationSchema = SchemaFactory.createForClass(Location)

LocationSchema.index({ search: 1 })

LocationSchema.index({ city: 1, state: 1 }, { unique: true })
