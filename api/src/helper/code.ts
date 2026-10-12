import { createHmac, randomInt } from 'crypto'

const ALGORITHM = 'sha256'

export const sign = (code: string, phone: string, secret: string): string =>
  createHmac(ALGORITHM, secret).update(`${phone}:${code}`).digest('hex')

export const generate = (): string => randomInt(100000, 1000000).toString()
