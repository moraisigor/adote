export const Kind = {
  CAT: 'cat',
  DOG: 'dog'
} as const

export type Kind = (typeof Kind)[keyof typeof Kind]
