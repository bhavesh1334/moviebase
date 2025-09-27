import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto {
  @ApiProperty({ example: 'The Shawshank Redemption', required: false })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({ example: 1994, minimum: 1900, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Publishing year must be a number' })
  @Min(1900, { message: 'Publishing year must be at least 1900' })
  @Max(new Date().getFullYear() + 10, { message: 'Publishing year cannot be more than 10 years in the future' })
  publishingYear?: number;
}

