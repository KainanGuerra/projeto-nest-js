import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { CpfCnpjValidator } from 'src/shared/helpers/cpf-cnpj.validator';
import { MESSAGE_ERROR } from 'src/shared/helpers/messages/error-messages.helper';
import { regexHelper } from 'src/shared/helpers/regex.helpers';

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
  @Validate(CpfCnpjValidator, {
    message: MESSAGE_ERROR.DOCUMENT_ALREADY_IN_USE,
  })
  document: string;
}
