import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { CpfCnpjValidator } from 'src/helpers/cpf-cnpj.validator';
import { MESSAGE_ERROR } from 'src/helpers/messages/error.messages';
import { regexHelper } from 'src/helpers/regex.helpers';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(regexHelper.password, {
    message: MESSAGE_ERROR.PASSWORD_INVALID,
  })
  password: string;

  @IsString()
  @Validate(CpfCnpjValidator)
  document: string;
}
