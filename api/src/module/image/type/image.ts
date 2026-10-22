export const IMAGE_SIZE = 2 * 1024 * 1024

// kind/key/extension
export const IMAGE_PATTERN = /^(pet|post|user|organization)\/[\w-]{24}\.webp$/

export const ImageKind = {
  PET: 'pet',
  POST: 'post',
  USER: 'user',
  ORGANIZATION: 'organization'
} as const

export const ImageExtension = {
  'image/webp': 'webp'
} as const

export type ImageKind = (typeof ImageKind)[keyof typeof ImageKind]

export type ImageExtension = keyof typeof ImageExtension

export const isKey = (key: string, kind: ImageKind): boolean =>
  new RegExp(`^${kind}/[\\w-]{24}\\.webp$`).test(key)
