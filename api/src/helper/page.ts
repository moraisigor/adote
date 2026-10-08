import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

export class PageRequest {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  readonly page: number = 1

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  readonly amount: number = 10
}
