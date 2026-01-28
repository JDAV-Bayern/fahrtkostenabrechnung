import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Button } from 'src/app/shared/ui/button';
import { Card, CardContent } from 'src/app/shared/ui/card';
import { MaterialExpense } from 'src/domain/expense.model';
import { ExpenseAmountPipe } from '../shared/expense-amount.pipe';
import { ExpenseTitlePipe } from '../shared/expense-title.pipe';

@Component({
  selector: 'jdav-material-expense-card',
  imports: [
    Button,
    CardContent,
    CurrencyPipe,
    DatePipe,
    ExpenseAmountPipe,
    ExpenseTitlePipe,
  ],
  templateUrl: './material-expense-card.html',
  host: {
    class: 'cursor-grab',
  },
  hostDirectives: [Card],
})
export class MaterialExpenseCard {
  readonly expense = input.required<MaterialExpense>();
  readonly editRow = output<void>();
  readonly deleteRow = output<void>();
}
