import { Breed } from './breed'
import { Gender } from './gender'
import { Kind } from './kind'
import { Size } from './size'

export type Pet = {
  readonly id: string
  readonly name: string
  readonly kind: Kind
  readonly size: Size
  readonly gender: Gender
  readonly breed: Breed
}
