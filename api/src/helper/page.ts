import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PageRequest {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  readonly page: number = 1

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  readonly amount: number = 10
}
