import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Shawshank Redemption' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ example: 1994, minimum: 1900 })
  @Type(() => Number)
  @IsNumber({}, { message: 'Publishing year must be a number' })
  @Min(1900, { message: 'Publishing year must be at least 1900' })
  @Max(new Date().getFullYear() + 10, {
    message: 'Publishing year cannot be more than 10 years in the future',
  })
  publishingYear: number;
}
