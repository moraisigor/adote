export type Token = {
  readonly token: {
    readonly hash: string
    readonly expire: number
  }
  readonly renew: {
    readonly hash: string
    readonly expire: number
  }
}
