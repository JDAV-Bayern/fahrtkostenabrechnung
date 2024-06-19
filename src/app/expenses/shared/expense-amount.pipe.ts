import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from 'src/domain/expense.model';
import { ExpenseService } from './expense.service';

@Pipe({
  name: 'expenseAmount',
  standalone: true
})
export class ExpenseAmountPipe implements PipeTransform {
  constructor(public expenseService: ExpenseService) {}

  transform(value: Expense): number {
    return this.expenseService.getAmount(value);
  }
}
