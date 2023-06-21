import { GoodsType } from '../../../types/goods.type.js';
import { OfferType } from '../../../types/offer.enum.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsOptional,
  ValidateNested,
  IsString,
  IsNumber,
} from 'class-validator';
import { Location } from './location.dto.js';
import { Type } from 'class-transformer';
import {
  MAXIMUM_RATING,
  MINIMUM_RATING,
  RATING_PRECISION,
} from '../../comment/comment.constant.js';
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

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(MINIMUM_OFFER_TITLE_LENGTH, {
    message: `Minimum title length must be ${MINIMUM_OFFER_TITLE_LENGTH}`,
  })
  @MaxLength(MAXIMUM_OFFER_TITLE_LENGTH, {
    message: `Maximum title length must be ${MAXIMUM_OFFER_TITLE_LENGTH}`,
  })
  public title?: string;

  @IsOptional()
  @MinLength(MINIMUM_OFFER_DESCRIPTION_LENGTH, {
    message: `Minimum description length must be ${MINIMUM_OFFER_DESCRIPTION_LENGTH}`,
  })
  @MaxLength(MAXIMUM_OFFER_DESCRIPTION_LENGTH, {
    message: `Maximum description length must be ${MAXIMUM_OFFER_DESCRIPTION_LENGTH}`,
  })
  public description?: string;

  @IsOptional()
  @IsMongoId({ message: 'city field must be valid an id' })
  public cityId?: string;

  @IsOptional()
  @IsString()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(REQUIRED_IMAGE_ARRAY_LENGTH)
  @ArrayMaxSize(REQUIRED_IMAGE_ARRAY_LENGTH)
  public images?: [string, string, string, string, string, string];

  @IsOptional()
  @IsBoolean({ message: 'Field isPremium must be an boolean' })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType, {
    each: true,
    message: 'Field type must be apartment, or room, or house, or hotel',
  })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: 'Field bedrooms must be an integer' })
  @Min(MINIMUM_OFFER_BEDROOMS, { message: `Minimum bedrooms is ${MINIMUM_OFFER_BEDROOMS}` })
  @Max(MAXIMUM_OFFER_BEDROOMS, { message: `Maximum bedrooms is ${MAXIMUM_OFFER_BEDROOMS}` })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: 'Field maxGuests must be an integer' })
  @Min(MINIMUM_OFFER_GUESTS, { message: `Minimum maxGuests is ${MINIMUM_OFFER_GUESTS}` })
  @Max(MAXIMUM_OFFER_GUESTS, { message: `Maximum maxGuests is ${MAXIMUM_OFFER_GUESTS}` })
  public maxGuests?: number;

  @IsOptional()
  @IsInt({ message: 'Field price must be an integer' })
  @Min(MINIMUM_OFFER_PRICE, { message: `Minimum price is ${MINIMUM_OFFER_PRICE}` })
  @Max(MAXIMUM_OFFER_PRICE, { message: `Maximum price is ${MAXIMUM_OFFER_PRICE}` })
  public price?: number;

  @IsOptional()
  @IsArray({ message: 'Field comfort must be an array' })
  @IsEnum(GoodsType, {
    each: true,
    message:
      'Field goods must be Breakfast, or Air conditioning, or Laptop friendly workspace, or Baby seat, or Washer, or Towels, or Fridge',
  })
  @ArrayUnique({ message: 'Field goods must be contain unique item' })
  public goods?: GoodsType[];

  @IsOptional()
  @ValidateNested({ message: 'This is not a "Location" type object!' })
  @Type(() => Location)
  public location?: Location;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: RATING_PRECISION },
    { message: `Допускается максимум ${RATING_PRECISION} числел после запятой` },
  )
  @Min(MINIMUM_RATING, { message: `Minimum rating is ${MINIMUM_RATING}` })
  @Max(MAXIMUM_RATING, { message: `Maximum rating is ${MAXIMUM_RATING}` })
  public rating?: number;
}
