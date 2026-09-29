import { Gender } from '@/type/gender'
import { Kind } from '@/type/kind'
import { Size } from '@/type/size'

export type ListPetRequest = {
  readonly page: number
  readonly amount: number
  readonly organization?: string
}

export type CreatePetRequest = {
  readonly name: string
  readonly kind: Kind
  readonly size: Size
  readonly gender: Gender
  readonly breed: string
  readonly organization?: string
}

export type SavePetRequest = {
  readonly name: string
  readonly kind: Kind
  readonly size: Size
  readonly gender: Gender
  readonly breed: string
}
