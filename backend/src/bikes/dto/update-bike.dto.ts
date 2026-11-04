import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

export class UpdateBikeDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  frameMaterial?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  frameSizeCm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  wheelSizeInches?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  gearCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  electric?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceCents?: number;
}