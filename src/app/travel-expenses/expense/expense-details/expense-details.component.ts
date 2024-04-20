import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  CarTypePipe,
  DiscountCardPipe,
  MealsPipe,
  AbsencePipe
} from 'src/app/pipes/expense.pipe';
import { Expense } from 'src/domain/expense';
import { JoinPipe } from '../../../pipes/join.pipe';

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
