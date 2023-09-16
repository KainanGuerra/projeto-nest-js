export class DocumentMasker {
  static maskCpf(cpf: string): string {
    const cleanedCpf = cpf.replace(/\D/g, '');

    if (!cleanedCpf || cleanedCpf.length !== 11) {
      throw new Error('Invalid CPF format');
    }

    return `***.${cleanedCpf.substr(3, 3)}.${cleanedCpf.substr(6, 3)}-**`;
  }
}
