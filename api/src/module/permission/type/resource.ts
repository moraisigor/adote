import type { Ref } from '@/helper/repository'

export type Resource = {
  readonly user?: Ref
  readonly organization?: Ref
}
