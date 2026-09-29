export type CreateOrganizationRequest = {
  readonly name: string
}

export type SaveOrganizationRequest = {
  readonly name: string
  readonly document?: string
  readonly contact?: {
    readonly mail?: string
    readonly phone?: string
    readonly social?: string
  }
}
