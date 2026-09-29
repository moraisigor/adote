import { create } from 'zustand'

type User = {
  readonly id: string
  readonly phone: string
}

type UserStore = {
  readonly user?: User
  setUser: (user: User) => void
}

const state = {}

export const useUserStore = create<UserStore>()((set) => ({
  ...state,
  setUser: (user: User) => set({ user })
}))
