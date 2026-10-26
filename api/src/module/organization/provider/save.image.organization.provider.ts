import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { ImageProvider } from '@/module/image/provider'
import { ImageKind } from '@/module/image/type/image'

import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class SaveImageOrganizationProvider {
  constructor(
    private readonly _image: ImageProvider,
    private readonly repository: OrganizationRepository
  ) {}

  async run(id: string, image: string, user: string): Promise<OrganizationResponse> {
    const valid = await this._image.validate.run([image], ImageKind.ORGANIZATION, user)

    if (!valid) {
      throw new BadRequestException()
    }

    const organization = await this.repository.save(
      new Types.ObjectId(id),
      { image },
      { returnDocument: 'after' }
    )

    if (isNil(organization)) {
      throw new NotFoundException()
    }

    return new OrganizationResponse(organization)
  }
}
