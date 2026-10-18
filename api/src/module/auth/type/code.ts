export type Code = {
  readonly hash: string
  readonly expire: number
  readonly attempt: number
}

export type Lock = {
  readonly count: number
  readonly expire: number
}
