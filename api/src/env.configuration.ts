import { plainToInstance as instance, Transform, type TransformFnParams } from 'class-transformer'
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator'
import { values } from 'lodash'

import { Env } from './helper/env'

const transform = ({ value }: TransformFnParams) => {
  if (value) {
    return Number(value)
  }
}

export class EnvConfiguration {
  @IsEnum(Env)
  readonly ENV!: Env

  @IsOptional()
  @IsInt()
  @Transform(transform)
  readonly PORT?: number

  // application
  @IsString()
  @IsNotEmpty()
  readonly APP_ORIGIN!: string

  @IsString()
  @IsNotEmpty()
  readonly MANAGER_ACCOUNT!: string

  // notify
  @IsString()
  @IsNotEmpty()
  readonly MAIL_KEY!: string

  @IsString()
  @IsNotEmpty()
  readonly MAIL_FROM!: string

  // request
  @IsOptional()
  @IsInt()
  @Transform(transform)
  readonly PROXY_HOP?: number

  @IsOptional()
  @IsInt()
  @Transform(transform)
  readonly REQUEST_TIME?: number

  @IsOptional()
  @IsInt()
  @Transform(transform)
  readonly REQUEST_LIMIT?: number

  // authentication
  @IsString()
  @IsNotEmpty()
  readonly CODE_SECRET!: string

  @IsString()
  @IsNotEmpty()
  readonly TOKEN_SECRET!: string

  @IsInt()
  @Transform(transform)
  readonly TOKEN_EXPIRE!: number

  @IsString()
  @IsNotEmpty()
  readonly TOKEN_RENEW_SECRET!: string

  @IsInt()
  @Transform(transform)
  readonly TOKEN_RENEW_EXPIRE!: number

  // storage
  @IsString()
  @IsNotEmpty()
  readonly STORAGE_KEY!: string

  @IsString()
  @IsNotEmpty()
  readonly STORAGE_SECRET!: string

  @IsString()
  @IsNotEmpty()
  readonly STORAGE_NAME!: string

  @IsString()
  @IsNotEmpty()
  readonly STORAGE_PATH!: string

  @IsString()
  @IsNotEmpty()
  readonly STORAGE_REGION!: string

  @IsString()
  @IsNotEmpty()
  readonly STORAGE_PUBLIC!: string

  // repository
  @IsString()
  @IsNotEmpty()
  readonly REPOSITORY_URI!: string

  @IsString()
  @IsNotEmpty()
  readonly REPOSITORY_USER!: string

  @IsString()
  @IsNotEmpty()
  readonly REPOSITORY_PASS!: string

  @IsString()
  @IsNotEmpty()
  readonly REPOSITORY_NAME!: string

  // observability
  @IsOptional()
  @IsString()
  readonly SENTRY_KEY?: string

  @IsOptional()
  @IsNumber()
  @Transform(transform)
  readonly SENTRY_RATE?: number
}

export const validate = (configuration: Record<string, unknown>): EnvConfiguration => {
  const environment = instance(EnvConfiguration, configuration)

  const error = validateSync(environment)

  if (error.length) {
    const message = error
      .map((e) => {
        const { constraints } = e

        return `- ${values(constraints).join(', ')}`
      })
      .join('\n')

    throw new Error(`environment configuration: ${error.length}\n${message}`)
  }

  return environment
}

export const configuration = validate(process.env)
