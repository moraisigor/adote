import { nanoid as id } from 'nanoid'

export const unique = (amount?: number): string => id(amount)
