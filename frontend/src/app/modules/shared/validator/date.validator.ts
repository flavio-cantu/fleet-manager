import { AbstractControl, ValidatorFn } from "@angular/forms";

export class DateValidator {
  // Validador para "dd/MM/yyyy HH:mm:ss"
  static validateDateTimeSeconds(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!value) {
        return null; 
      }

      const regex = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

      if (!regex.test(value)) {
        return { invalidDate: true };
      }

      return DateValidator.validateDateTime(value) ? null : { invalidDate: true };
    };
  }

  // Validador para "dd/MM/yyyy"
  static validateDateOnly(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      

      return DateValidator.validateDate(value) ? null : { invalidDate: true };
    };
  }

  // Lógica pra validar "dd/MM/yyyy HH:mm:ss"
  private static validateDateTime(date: string): boolean {
    try {
      const [datePart, timePart] = date.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);

      const parsedDate = new Date(year, month - 1, day, hour, minute, second);

      return (
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day &&
        parsedDate.getHours() === hour &&
        parsedDate.getMinutes() === minute &&
        parsedDate.getSeconds() === second
      );
    } catch {
      return false;
    }
  }

  // Lógica pra validar "dd/MM/yyyy"
  private static validateDate(date: string): boolean {
    try {
      const [ year, month,day ] = date.split("-").map(Number);

      const parsedDate = new Date(year, month - 1, day);

      return (
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day
      );
    } catch {
      return false;
    }
  }
}
