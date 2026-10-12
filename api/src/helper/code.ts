import { randomInt } from 'crypto'

export const generate = (): string => String(randomInt(100000, 1000000))
