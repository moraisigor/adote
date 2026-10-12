import type { Types } from 'mongoose'

export type Ref = { id: string } | Types.ObjectId

export type Resource = {
  readonly user?: Ref
  readonly organization?: Ref
}
