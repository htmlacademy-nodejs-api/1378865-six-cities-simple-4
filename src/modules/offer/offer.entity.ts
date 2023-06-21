import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { Coordinates } from '../../types/coordinates.type.js';
import { GoodsType } from '../../types/goods.type.js';
import { OfferType } from '../../types/offer.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { CityEntity } from '../city/city.entity.js';
import { DEFAULT_COMMENT_COUNT, DEFAULT_RATING } from '../comment/comment.constant.js';
import { DEFAULT_PREVIEW_IMAGE } from './offer.constant.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}
@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true })
  public title!: string;

  @prop({ required: true, trim: true })
  public description!: string;

  @prop({ ref: CityEntity, required: true })
  public cityId!: Ref<CityEntity>;

  @prop({ required: true, trim: true, default: DEFAULT_PREVIEW_IMAGE })
  public previewImage!: string;

  @prop({ required: true, trim: true })
  public images!: string[];

  @prop({ required: true, default: true })
  public isPremium!: boolean;

  @prop({ required: false, default: DEFAULT_RATING })
  public rating!: number;

  @prop({ required: true, enum: OfferType })
  public type!: OfferType;

  @prop({ required: true })
  public bedrooms!: number;

  @prop({ required: true })
  public maxGuests!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true })
  public goods!: GoodsType[];

  @prop({ ref: UserEntity, required: true })
  public userId!: Ref<UserEntity>;

  @prop({ required: false, default: DEFAULT_COMMENT_COUNT })
  public commentCount!: number;

  @prop({ required: true })
  public location!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
