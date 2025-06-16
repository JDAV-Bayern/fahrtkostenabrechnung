import { Pipe, PipeTransform } from '@angular/core';

export function formatExpenseType(value: string): string | null {
  switch (value) {
    case 'transport':
      return 'Fahrtkosten';
    case 'food':
      return 'Verpflegung';
    case 'material':
      return 'Sachkosten';
    default:
      return null;
  }
}

@Pipe({
  name: 'expenseType'
})
export class ExpenseTypePipe implements PipeTransform {
  transform(value: string): string | null {
    return formatExpenseType(value);
  }
}
