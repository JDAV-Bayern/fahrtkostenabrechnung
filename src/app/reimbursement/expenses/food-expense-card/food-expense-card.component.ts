import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ReimbursementService } from 'src/app/reimbursement/shared/reimbursement.service';
import { Absence, FoodExpense } from 'src/domain/expense.model';
import { ExpenseAmountPipe } from '../shared/expense-amount.pipe';
import { AbsencePipe } from '../shared/expense-data.pipe';

let nextInputId = 0;

@Component({
  selector: 'app-food-expense-card',
  templateUrl: './food-expense-card.component.html',
  styleUrls: ['./food-expense-card.component.css'],
  imports: [CurrencyPipe, DatePipe, FormField, AbsencePipe, ExpenseAmountPipe],
})
export class FoodExpenseCardComponent {
  private readonly reimbursementService = inject(ReimbursementService);

  readonly field = input.required<FieldTree<FoodExpense>>();

  inputId = nextInputId++;

  getAllowance(absence: Absence) {
    const foodConfig = this.reimbursementService.config()?.food;
    return foodConfig ? foodConfig[absence] : 0;
  }
}
