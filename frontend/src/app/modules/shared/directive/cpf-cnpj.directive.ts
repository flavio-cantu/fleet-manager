// filepath: /workspace/evolucao-frontend/src/app/modules/shared/directive/cpf-cnpj.directive.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cpfCnpjMask',
    standalone: true // Certifique-se de que o pipe é standalone
})
export class CpfCnpjMaskPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';

        const cleanValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cleanValue.length > 11) {
            // Formata como CNPJ
            return cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        } else {
            // Formata como CPF
            return cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        }
    }
}