import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

/**
 * Data Transfer Object (DTO) for pagination.
 * 
 * @property page - The page number to retrieve.
 * @property limit - The number of items to retrieve per page.
 */
export class PaginationDto {
  /**
   * The page number to retrieve.
   */
  @ApiProperty({
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  /**
   * The number of items to retrieve per page.
   */
  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
