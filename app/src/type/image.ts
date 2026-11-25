export const ImageKind = {
  PET: 'pet',
  POST: 'post',
  USER: 'user',
  ORGANIZATION: 'organization'
} as const

export type ImageKind = (typeof ImageKind)[keyof typeof ImageKind]

export const IMAGE_SIZE = 2 * 1024 * 1024
