import { GoodsType } from '../../../types/goods.type.js';
import { OfferType } from '../../../types/offer.enum.js';
import {
  MaxLength,
  MinLength,
  IsMongoId,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  Max,
  ArrayUnique,
  IsOptional,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Location } from './location.dto.js';
import { Type } from 'class-transformer';

export default class CreateOfferDto {
  @MinLength(10, { message: 'Minimum title length must be 10' })
  @MaxLength(100, { message: 'Maximum title length must be 100' })
  public title!: string;

  @MinLength(20, { message: 'Minimum description length must be 20' })
  @MaxLength(1024, { message: 'Maximum description length must be 1024' })
  public description!: string;

  @IsMongoId({ message: 'city field must be valid an id' })
  public cityId!: string;

  @IsOptional()
  public previewImage?: string;

  @IsOptional()
  @ArrayMinSize(6, { message: 'Minimum images is 6' })
  @ArrayMaxSize(6, { message: 'Maximum images is 6' })
  public images?: string[];

  @IsBoolean({ message: 'Field isPremium must be an boolean' })
  public isPremium!: boolean;

  @IsEnum(OfferType, { message: 'Field type must be apartment, or room, or house, or hotel' })
  public type!: OfferType;

  @IsInt({ message: 'Field bedrooms must be an integer' })
  @Min(1, { message: 'Minimum bedrooms is 1' })
  @Max(8, { message: 'Maximum bedrooms is 8' })
  public bedrooms!: number;

  @IsInt({ message: 'Field maxGuests must be an integer' })
  @Min(1, { message: 'Minimum maxGuests is 1' })
  @Max(10, { message: 'Maximum maxGuests is 10' })
  public maxGuests!: number;

  @IsInt({ message: 'Field price must be an integer' })
  @Min(100, { message: 'Minimum price is 100' })
  @Max(100000, { message: 'Maximum price is 100000' })
  public price!: number;

  @IsArray({ message: 'Field comfort must be an array' })
  @IsEnum(GoodsType, {
    each: true,
    message:
      'Field goods must be Breakfast, or Air conditioning, or Laptop friendly workspace, or Baby seat, or Washer, or Towels, or Fridge',
  })
  @ArrayUnique({ message: 'Field goods must be contain unique item' })
  public goods!: GoodsType[];

  public userId!: string;

  @IsOptional()
  @IsDateString()
  public createdAt!: string;

  @ValidateNested({ message: 'This is not a "Location" type object!' })
  @Type(() => Location)
  public location!: Location;
}
