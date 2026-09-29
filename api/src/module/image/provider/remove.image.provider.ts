import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RemoveImageProvider {
  constructor(private readonly config: ConfigService) {}

  async run() {}
}
