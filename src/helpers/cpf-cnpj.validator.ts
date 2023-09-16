import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'cpfCnpj', async: false })
export class CpfCnpjValidator implements ValidatorConstraintInterface {
  validate(document: string) {
    const isCPF = cpf.isValid(document);
    const isCNPJ = cnpj.isValid(document);
    return isCPF || isCNPJ;
  }

  defaultMessage() {
    return 'Invalid CPF or CNPJ format';
  }
}
