export const Size = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const

export type Size = (typeof Size)[keyof typeof Size]
