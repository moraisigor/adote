export type SaveUserRequest = {
  readonly name: string
  readonly contact?: {
    readonly mail?: string
    readonly phone?: string
    readonly social?: string
  }
  readonly location?: string
}
