import { configuration } from '@/env.configuration'

export const url = (image?: string) => {
  if (image) {
    return `${configuration.STORAGE_PUBLIC}/${image}`
  }
}
