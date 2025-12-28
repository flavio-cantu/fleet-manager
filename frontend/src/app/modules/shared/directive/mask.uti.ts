import { cpfCnpjFormat } from './cpf-cnpj.directive';

export class MaskUtil {
  public static removeFormatting(value: string): string {
    return value.replace(/\D/g, '');
  }

  private static isCpfCnpj(columnName: string): boolean {
    const column = columnName.toLowerCase();
    return column.indexOf('cpf') != -1 || column.indexOf('cnpj') != -1;
  }

  private static isPhone(columnName: string): boolean {
    const column = columnName.toLowerCase();
    return column.indexOf('phone') != -1 || column.indexOf('fax') != -1;
  }

  public static parseMask(value: any, mask?: string | undefined): string {
    const fieldName = value.colDef.field;
    if (this.isCpfCnpj(fieldName)) {
      return cpfCnpjFormat(value.value);
    } else if (this.isPhone(fieldName)) {
      return phoneFormat(value.value);
    } else if (mask === 'decimal') {
      return decimal(value.value);
    } else if (mask === 'currency') {
      return 'R$ ' + decimal(value.value);
    } else if (mask === 'percentage') {
      return percentage(value.value);
    }
    return value.value;
  }
}

export function phoneFormat(value: string): string {
  if (!value) return '';

  const cleanValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (cleanValue.length === 11) {
    // Formata como celular: (11) 99999-9999
    return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleanValue.length === 10) {
    // Formata como telefone fixo: (11) 3333-4444
    return cleanValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (cleanValue.length === 13) {
    // Formata número internacional: +55 (11) 99999-9999
    return cleanValue.replace(
      /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
      '+$1 ($2) $3-$4'
    );
  } else {
    // Retorna o valor original se não corresponder aos padrões
    return value;
  }
}

export function decimal(value: number | string, decimals: number = 2): string {
  if (value === null || value === undefined || value === '') return '0,00';

  const num =
    typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;

  if (isNaN(num)) return '0,00';

  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function percentage(
  value: number | string,
  decimals: number = 2
): string {
  if (value === null || value === undefined || value === '') return '0,00%';

  const num =
    typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;

  if (isNaN(num)) return '0,00%';

  return (
    num.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + '%'
  );
}
