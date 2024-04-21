import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  CarTypePipe,
  DiscountCardPipe,
  MealsPipe,
  AbsencePipe
} from 'src/app/expenses/shared/expense-data.pipe';
import { JoinPipe } from 'src/app/shared/join.pipe';
import { Expense } from 'src/domain/expense.model';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css'],
  standalone: true,
  imports: [
    NgIf,
    DecimalPipe,
    CurrencyPipe,
    DiscountCardPipe,
    CarTypePipe,
    JoinPipe,
    MealsPipe,
    AbsencePipe
  ]
})
export class ExpenseDetailsComponent {
  @Input({ required: true })
  expense!: Expense;
}
