import { SetMetadata } from '@nestjs/common'

import type { Role } from '@/module/user/type/role'

export const Permission = (role: Role[]) => SetMetadata('permission', role)
