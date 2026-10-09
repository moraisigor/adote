export const Gender = {
  MALE: 'male',
  FEMALE: 'female'
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]
