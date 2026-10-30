import { isNil } from 'lodash'

import type { Token } from '@/module/auth/type/token'
import { Role } from '@/module/user/type/role'

export type Session = {
  id: string
  token: Token
  renew: Token
}

export class Authentication {
  private readonly session = new Map<Role, Session>()

  get(key: Role = Role.MEMBER): Session {
    const session = this.session.get(key)

    if (isNil(session)) {
      throw new Error(`the session is null for ${key}`)
    }

    return session
  }

  set(key: Role, session: Session) {
    this.session.set(key, session)
  }

  remove(key: Role) {
    this.session.delete(key)
  }
}
