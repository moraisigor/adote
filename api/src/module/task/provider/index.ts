import { Injectable } from '@nestjs/common'

import { CleanStorageTaskProvider } from './clean.storage.task.provider'

@Injectable()
export class TaskProvider {
  constructor(readonly storage: CleanStorageTaskProvider) {}
}
