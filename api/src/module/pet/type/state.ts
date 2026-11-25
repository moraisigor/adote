export const State = {
  ADOPT: 'adopt',
  PRIVATE: 'private',
  PUBLIC: 'public'
} as const

export type State = (typeof State)[keyof typeof State]
