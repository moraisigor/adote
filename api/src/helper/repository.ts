import { Types } from 'mongoose'

export type Ref = { id: string } | Types.ObjectId

export const id = (ref?: Ref) => {
  if (ref instanceof Types.ObjectId) {
    return ref.toHexString()
  }

  return ref?.id
}

export const object = (ref?: string | { id: string }) => {
  const id = typeof ref === 'string' ? ref : ref?.id

  if (id) {
    return new Types.ObjectId(id)
  }
}
