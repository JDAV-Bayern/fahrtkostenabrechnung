import { Pipe, PipeTransform, inject } from '@angular/core';
import { Expense } from 'src/domain/expense.model';
import { ExpenseService } from './expense.service';

@Pipe({
  name: 'expenseAmount',
  standalone: true
})
export class ExpenseAmountPipe implements PipeTransform {
  private readonly expenseService = inject(ExpenseService);

  transform(value: Expense): number {
    return this.expenseService.getAmount(value);
  }
}
