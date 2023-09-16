import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { CpfCnpjValidator } from 'src/helpers/cpf-cnpj.validator';
import { regexHelper } from 'src/helpers/regex.helpers';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(regexHelper.password)
  password: string;

  @IsString()
  @Validate(CpfCnpjValidator)
  document: string;
}
