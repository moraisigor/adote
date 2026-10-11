import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

import type { FastifyRequest } from 'fastify'

import type { Session } from '@/type/token'

export const Current = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest<FastifyRequest & { user: Session }>()

  return user
})
