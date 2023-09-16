import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as cpfCnpjValidator from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'cpfCnpj', async: false })
export class CpfCnpjValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    const isCPF = cpfCnpjValidator.cpf.isValid(value);
    const isCNPJ = cpfCnpjValidator.cnpj.isValid(value);

    return isCPF || isCNPJ;
  }

  defaultMessage() {
    return 'Invalid CPF or CNPJ format';
  }
}
