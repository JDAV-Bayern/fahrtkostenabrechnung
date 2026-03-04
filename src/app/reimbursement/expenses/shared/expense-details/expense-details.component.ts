import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { JoinPipe } from 'src/app/shared/join.pipe';
import { Expense } from 'src/domain/expense.model';
import { ExpenseConfigService } from '../expense-config.service';
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
export class ExpenseDetailsComponent implements OnInit {
  readonly expense = input.required<Expense>();

  readonly expenseConfigService = inject(ExpenseConfigService);

  planFixedReimbursementAmount: number | null = null;

  ngOnInit() {
    if (this.expense().type === 'transport') {
      this.expenseConfigService.getConfig('course').subscribe((config) => {
        this.planFixedReimbursementAmount = config.transport?.plan ?? null;
      });
    }
  }
}
