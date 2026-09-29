import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

import type { FastifyRequest } from 'fastify'

export const UserCurrent = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest<FastifyRequest>()

  return user
})
