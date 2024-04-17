import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CarTypePipe, DiscountCardPipe } from 'src/app/pipes/expense.pipe';
import { Expense } from 'src/domain/expense';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css'],
  standalone: true,
  imports: [NgIf, DecimalPipe, CurrencyPipe, DiscountCardPipe, CarTypePipe]
})
export class ExpenseDetailsComponent {
  @Input({ required: true })
  expense!: Expense;
}
