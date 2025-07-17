import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Button } from 'src/app/shared/ui/button';
import { Expense } from 'src/domain/expense.model';
import { ExpenseAmountPipe } from '../shared/expense-amount.pipe';
import { ExpenseDetailsComponent } from '../shared/expense-details/expense-details.component';
import { ExpenseTitlePipe } from '../shared/expense-title.pipe';

@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.css'],
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    ExpenseTitlePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent,
  ],
})
export class ExpenseCardComponent {
  readonly expense = input.required<Expense>();

  readonly editRow = output<void>();
  readonly deleteRow = output<void>();

  editMe() {
    this.editRow.emit();
  }

  deleteMe() {
    this.deleteRow.emit();
  }
}
