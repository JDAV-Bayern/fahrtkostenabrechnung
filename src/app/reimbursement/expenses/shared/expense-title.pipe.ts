import { Expense } from '@/domain/expense.model';
import { Pipe, PipeTransform } from '@angular/core';
import { formatAbsence } from './expense-data.pipe';
import { formatTransportMode } from './transport-mode.pipe';

@Pipe({
  name: 'expenseTitle',
})
export class ExpenseTitlePipe implements PipeTransform {
  transform(value: Expense): string {
    switch (value.type) {
      case 'transport':
        return formatTransportMode(value.mode);
      case 'food':
        return 'Abwesenheit ' + formatAbsence(value.absence);
      case 'material':
        return value.purpose;
    }
  }
}
