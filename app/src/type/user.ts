import { Contact } from './contact'
import { Location } from './location'

export type User = {
  readonly id: string
  readonly phone: string
  readonly name?: string
  readonly image?: string
  readonly organization?: {
    readonly id: string
    readonly name: string
  }
  readonly contact?: Contact
  readonly location?: Location
}
