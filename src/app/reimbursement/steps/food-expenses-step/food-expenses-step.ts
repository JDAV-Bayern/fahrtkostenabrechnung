import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { FoodExpenseCardComponent } from 'src/app/expenses/food-expense-card/food-expense-card.component';
import { ExpenseService } from 'src/app/expenses/shared/expense.service';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Button } from 'src/app/shared/ui/button';

@Component({
  selector: 'jdav-food-expenses-step',
  templateUrl: './food-expenses-step.html',
  imports: [
    Button,
    ReactiveFormsModule,
    CurrencyPipe,
    FoodExpenseCardComponent,
  ],
})
export class FoodExpensesStep {
  private readonly expenseService = inject(ExpenseService);
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.foodExpensesStep;
  private formValue = toSignal(this.form.valueChanges, { initialValue: [] });
  total = computed(() =>
    this.formValue().reduce(
      (sum, expense) => sum + this.expenseService.getAmount(expense),
      0,
    ),
  );

  get isFoodEnabled() {
    return this.controlService.foodSettings.controls.isEnabled;
  }
}
