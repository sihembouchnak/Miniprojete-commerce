import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsPositive,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
