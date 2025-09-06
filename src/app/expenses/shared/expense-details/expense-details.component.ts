import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  DiscountPipe,
  EngineTypePipe,
  MealsPipe
} from 'src/app/expenses/shared/expense-data.pipe';
import { JoinPipe } from 'src/app/shared/join.pipe';
import { Expense } from 'src/domain/expense.model';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  imports: [
    DecimalPipe,
    CurrencyPipe,
    DiscountPipe,
    EngineTypePipe,
    JoinPipe,
    MealsPipe
  ]
})
export class ExpenseDetailsComponent {
  readonly expense = input.required<Expense>();
}
