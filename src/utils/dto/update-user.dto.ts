import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { regexHelper } from 'src/helpers/regex.helpers';

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsString()
  @Matches(regexHelper.password)
  password?: string;
}
