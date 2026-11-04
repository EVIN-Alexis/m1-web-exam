import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

export class CreateBikeDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  frameMaterial: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  frameSizeCm: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  wheelSizeInches: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  gearCount: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceCents: number;
}