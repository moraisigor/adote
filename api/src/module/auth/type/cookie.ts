import type { CookieSerializeOptions } from '@fastify/cookie'

export const Option: CookieSerializeOptions = {
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'strict'
}

export const RenewOption: CookieSerializeOptions = Object.assign({}, Option, {
  path: '/api/auth'
})
