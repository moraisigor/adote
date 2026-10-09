export const OrganizationRole = {
  MEMBER: 'member',
  MANAGER: 'manager'
} as const

export type OrganizationRole = (typeof OrganizationRole)[keyof typeof OrganizationRole]
