import { Injectable } from '@nestjs/common'

import type { FastifyReply } from 'fastify'

import { Option } from '../type/cookie'

@Injectable()
export class ExpireAuthProvider {
  run(reply: FastifyReply) {
    reply.clearCookie('token', Option)
    reply.clearCookie('renew', Option)
  }
}
