import { IsBoolean, IsEmail, MaxLength, MinLength } from 'class-validator';
import {
  MAXIMUM_USER_NAME_LENGTH,
  MAXIMUM_USER_PASSWORD_LENGTH,
  MINIMUM_USER_NAME_LENGTH,
  MINIMUM_USER_PASSWORD_LENGTH,
} from '../user.constant.js';

export default class CreateUserDto {
  @MinLength(MINIMUM_USER_NAME_LENGTH, {
    message: `Minimum name length must be ${MINIMUM_USER_NAME_LENGTH}`,
  })
  @MaxLength(MAXIMUM_USER_NAME_LENGTH, {
    message: `Maximum name length must be ${MAXIMUM_USER_NAME_LENGTH}`,
  })
  public name!: string;

  @IsEmail({}, { message: 'Fail! Email must be valid address' })
  public email!: string;

  @MinLength(MINIMUM_USER_PASSWORD_LENGTH, {
    message: `Minimum password length must be ${MINIMUM_USER_PASSWORD_LENGTH}`,
  })
  @MaxLength(MAXIMUM_USER_PASSWORD_LENGTH, {
    message: `Maximum password length must be ${MAXIMUM_USER_PASSWORD_LENGTH}`,
  })
  public password!: string;

  @IsBoolean({ message: 'Field isPro must be an boolean' })
  public isPro!: boolean;
}
