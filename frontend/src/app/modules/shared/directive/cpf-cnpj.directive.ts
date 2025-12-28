import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpjMask',
  standalone: true,
})
export class CpfCnpjMaskPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    return cpfCnpjFormat(value);
  }
}

export function cpfCnpjFormat(value: string): string {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cleanValue.length > 11) {
    // Formata como CNPJ
    return cleanValue.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  } else {
    // Formata como CPF
    return cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}
