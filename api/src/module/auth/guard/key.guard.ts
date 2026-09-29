import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class KeyGuard extends AuthGuard('Key') {}
