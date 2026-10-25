import { Injectable, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { PUBLIC } from '@/decorator/public.decorator'

@Injectable()
export class TokenGuard extends AuthGuard('Token') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [
      context.getClass(),
      context.getHandler()
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }
}
