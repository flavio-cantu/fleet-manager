import { Pipe, PipeTransform } from "@angular/core";
import { decimal, percentage } from "./mask.uti";

@Pipe({
  name: 'decimalMask',
  standalone: true,
})
export class DecimalMaskPipe implements PipeTransform {
  transform(value: number | string | undefined | null): string {
    if (!value) return '0,00';
    return decimal(value);
  }
}
@Pipe({
  name: 'percentMask',
  standalone: true,
})
export class PercentMaskPipe implements PipeTransform {
  transform(value: number | string | undefined | null): string {
    if (!value) return '0%';
    return percentage(value);
  }
}