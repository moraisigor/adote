import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OrganizationStore = {
  readonly current?: string
  setCurrent: (current: string) => void
}

const state = {}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      ...state,
      setCurrent: (current: string) => set({ current })
    }),
    {
      name: 'Organization'
    }
  )
)
