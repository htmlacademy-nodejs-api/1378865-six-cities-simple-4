import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { MAXIMUM_USER_PASSWORD_LENGTH, MINIMUM_USER_PASSWORD_LENGTH } from '../user.constant.js';

export default class LoginUserDto {
  @IsEmail({}, { message: 'Fail! Email must be a valid address' })
  public email!: string;

  @MinLength(MINIMUM_USER_PASSWORD_LENGTH, {
    message: `Minimum password length must be ${MINIMUM_USER_PASSWORD_LENGTH}`,
  })
  @MaxLength(MAXIMUM_USER_PASSWORD_LENGTH, {
    message: `Maximum password length must be ${MAXIMUM_USER_PASSWORD_LENGTH}`,
  })
  public password!: string;
}
