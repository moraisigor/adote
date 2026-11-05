import { isNil, fromPairs as pair, partition, mapValues as values } from 'lodash-es'
import { Types } from 'mongoose'

export type Ref = { id: string } | Types.ObjectId

export const LEAN = { virtuals: true }

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

// if property is present $set
// if property is missing $unset
export const assign = (map: Record<string, unknown>) => {
  const [remove, set] = partition(Object.entries(map), ([, value]) => isNil(value))

  return {
    $set: pair(set),
    $unset: values(pair(remove), () => '')
  }
}
