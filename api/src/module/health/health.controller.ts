import { Controller, Get } from '@nestjs/common'

import { Public } from '@/decorator/public.decorator'

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  get(): { state: boolean } {
    return {
      state: true
    }
  }
}
