import { createHmac, randomInt, timingSafeEqual } from 'crypto'

const ALGORITHM = 'sha256'

export const sign = (code: string, phone: string, secret: string): string =>
  createHmac(ALGORITHM, secret).update(`${phone}:${code}`).digest('hex')

export const equals = (
  hash: string,
  verify: {
    code: string
    phone: string
    secret: string
  }
): boolean => {
  const { code, phone, secret } = verify

  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(sign(code, phone, secret), 'hex'))
}

export const generate = (): string => randomInt(100000, 1000000).toString()
