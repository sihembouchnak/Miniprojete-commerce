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

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  category?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
