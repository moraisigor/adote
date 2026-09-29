import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Token = {
  readonly token: {
    readonly hash: string
    readonly expire: number
  }
  readonly renew: {
    readonly hash: string
    readonly expire: number
  }
}

type TokenStore = {
  readonly token?: Token
  setToken: (token: Token) => void
}

const state = {}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      ...state,
      setToken: (token: Token) => set({ token })
    }),
    {
      name: 'Token'
    }
  )
)
