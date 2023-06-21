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
import {
  MAXIMUM_OFFER_BEDROOMS,
  MAXIMUM_OFFER_DESCRIPTION_LENGTH,
  MAXIMUM_OFFER_GUESTS,
  MAXIMUM_OFFER_PRICE,
  MAXIMUM_OFFER_TITLE_LENGTH,
  MINIMUM_OFFER_BEDROOMS,
  MINIMUM_OFFER_DESCRIPTION_LENGTH,
  MINIMUM_OFFER_GUESTS,
  MINIMUM_OFFER_PRICE,
  MINIMUM_OFFER_TITLE_LENGTH,
  REQUIRED_IMAGE_ARRAY_LENGTH,
} from '../offer.constant.js';

export default class CreateOfferDto {
  @MinLength(MINIMUM_OFFER_TITLE_LENGTH, {
    message: `Minimum title length must be ${MINIMUM_OFFER_TITLE_LENGTH}`,
  })
  @MaxLength(MAXIMUM_OFFER_TITLE_LENGTH, {
    message: `Maximum title length must be ${MAXIMUM_OFFER_TITLE_LENGTH}`,
  })
  public title!: string;

  @MinLength(MINIMUM_OFFER_DESCRIPTION_LENGTH, {
    message: `Minimum description length must be ${MINIMUM_OFFER_DESCRIPTION_LENGTH}`,
  })
  @MaxLength(MAXIMUM_OFFER_DESCRIPTION_LENGTH, {
    message: `Maximum description length must be ${MAXIMUM_OFFER_DESCRIPTION_LENGTH}`,
  })
  public description!: string;

  @IsMongoId({ message: 'city field must be valid an id' })
  public cityId!: string;

  @IsOptional()
  public previewImage?: string;

  @IsOptional()
  @ArrayMinSize(REQUIRED_IMAGE_ARRAY_LENGTH, {
    message: `Minimum images is ${REQUIRED_IMAGE_ARRAY_LENGTH}`,
  })
  @ArrayMaxSize(REQUIRED_IMAGE_ARRAY_LENGTH, {
    message: `Maximum images is ${REQUIRED_IMAGE_ARRAY_LENGTH}`,
  })
  public images?: string[];

  @IsBoolean({ message: 'Field isPremium must be an boolean' })
  public isPremium!: boolean;

  @IsEnum(OfferType, { message: 'Field type must be apartment, or room, or house, or hotel' })
  public type!: OfferType;

  @IsInt({ message: 'Field bedrooms must be an integer' })
  @Min(MINIMUM_OFFER_BEDROOMS, { message: `Minimum bedrooms is ${MINIMUM_OFFER_BEDROOMS}` })
  @Max(MAXIMUM_OFFER_BEDROOMS, { message: `Maximum bedrooms is ${MAXIMUM_OFFER_BEDROOMS}` })
  public bedrooms!: number;

  @IsInt({ message: 'Field maxGuests must be an integer' })
  @Min(MINIMUM_OFFER_GUESTS, { message: `Minimum maxGuests is ${MINIMUM_OFFER_GUESTS}` })
  @Max(MAXIMUM_OFFER_GUESTS, { message: `Maximum maxGuests is ${MAXIMUM_OFFER_GUESTS}` })
  public maxGuests!: number;

  @IsInt({ message: 'Field price must be an integer' })
  @Min(MINIMUM_OFFER_PRICE, { message: `Minimum price is ${MINIMUM_OFFER_PRICE}` })
  @Max(MAXIMUM_OFFER_PRICE, { message: `Maximum price is ${MAXIMUM_OFFER_PRICE}` })
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
  public createdAt?: string;

  @ValidateNested({ message: 'This is not a "Location" type object!' })
  @Type(() => Location)
  public location!: Location;
}
