import type { Types } from 'mongoose'

export type Scope = { readonly user: Types.ObjectId } | { readonly organization: Types.ObjectId }
