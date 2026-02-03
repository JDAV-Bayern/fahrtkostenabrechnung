import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { JoinPipe } from 'src/app/shared/join.pipe';
import { Expense } from 'src/domain/expense.model';
import { DiscountPipe, EngineTypePipe, MealsPipe } from '../expense-data.pipe';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  imports: [
    DecimalPipe,
    CurrencyPipe,
    DiscountPipe,
    EngineTypePipe,
    JoinPipe,
    MealsPipe,
  ],
})
export class ExpenseDetailsComponent {
  readonly expense = input.required<Expense>();
}
