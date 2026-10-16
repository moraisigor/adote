import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false })
export class Contact {
  @Prop({ type: String })
  mail?: string

  @Prop({ type: String })
  phone?: string

  @Prop({ type: String })
  social?: string
}
