import { IsNumber, Max, Min } from 'class-validator';
import {
  MAXIMUM_LATITUDE,
  MAXIMUM_LONGITUDE,
  MINIMUM_LATITUDE,
  MINIMUM_LONGITUDE,
} from '../../../constants/index.js';

export class Location {
  @IsNumber()
  @Min(MINIMUM_LATITUDE)
  @Max(MAXIMUM_LATITUDE)
  public latitude!: number;

  @IsNumber()
  @Min(MINIMUM_LONGITUDE)
  @Max(MAXIMUM_LONGITUDE)
  public longitude!: number;
}
