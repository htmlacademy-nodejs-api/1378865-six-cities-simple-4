import { IsMongoId, IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator';
import {
  MAXIMUM_COMMENT_LENGTH,
  MAXIMUM_RATING,
  MINIMUM_COMMENT_LENGTH,
  MINIMUM_RATING,
  RATING_PRECISION,
} from '../comment.constant.js';

export default class CreateCommentDto {
  @MinLength(MINIMUM_COMMENT_LENGTH, {
    message: `Minimum text length must be ${MINIMUM_COMMENT_LENGTH}`,
  })
  @MaxLength(MAXIMUM_COMMENT_LENGTH, {
    message: `Maximum text length must be ${MAXIMUM_COMMENT_LENGTH}`,
  })
  public text!: string;

  @IsNumber(
    { maxDecimalPlaces: RATING_PRECISION },
    { message: `Допускается максимум ${RATING_PRECISION} числел после запятой` },
  )
  @Min(MINIMUM_RATING, { message: `Minimum rating is ${MINIMUM_RATING}` })
  @Max(MAXIMUM_RATING, { message: `Maximum rating is ${MAXIMUM_RATING}` })
  public rating!: number;

  @IsMongoId({ message: 'Categories field must be an array of valid id' })
  public offerId!: string;

  public userId!: string;
}
