import type { CookieSerializeOptions } from '@fastify/cookie'

export const Option: CookieSerializeOptions = {
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'strict'
}
