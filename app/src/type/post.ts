import { Organization } from './organization'
import { Pet } from './pet'
import { User } from './user'

export type Post = {
  readonly id: string
  readonly image: string[]
  readonly pet: Pet
  readonly location: Location
  readonly user?: User
  readonly organization?: Organization
}
