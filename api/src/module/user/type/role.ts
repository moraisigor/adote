export const Role = {
  MEMBER: 'member',
  MANAGER: 'manager'
} as const

export type Role = (typeof Role)[keyof typeof Role]
