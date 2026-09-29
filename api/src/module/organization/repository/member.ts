import { Prop, Schema } from '@nestjs/mongoose'

import { Types } from 'mongoose'

import type { UserDocument } from '@/module/user/repository/user.schema'

import { OrganizationRole } from '../type/organization.role'

@Schema({ _id: false })
export class Member {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId | UserDocument

  @Prop({ type: String, enum: OrganizationRole, default: OrganizationRole.MEMBER, required: true })
  role: OrganizationRole = OrganizationRole.MEMBER
}
