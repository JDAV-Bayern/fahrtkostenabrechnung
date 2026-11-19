import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ReimbursementFormService } from 'src/app/reimbursement/shared/reimbursement-form.service';
import { Button } from 'src/app/shared/ui/button';
import { ExpenseListComponent } from '../../expenses/expense-list/expense-list.component';
import { FoodExpenseCardComponent } from '../../expenses/food-expense-card/food-expense-card.component';

@Component({
  selector: 'app-expenses-extra-step',
  templateUrl: './expenses-extra-step.component.html',
  styleUrls: ['./expenses-extra-step.component.css'],
  imports: [
    Button,
    CurrencyPipe,
    ExpenseListComponent,
    FoodExpenseCardComponent,
  ],
})
export class ExpensesExtraStepComponent {
  private readonly formService = inject(ReimbursementFormService);

  readonly showFood = input(true);

  readonly form = this.formService.form.expenses;
  readonly foodSettings = this.formService.foodSettingsForm;
  readonly foodEnabled = this.formService.foodEnabled;

  readonly foodCount = computed(
    () => this.formService.model().expenses.food.length,
  );

  readonly transportTotal = computed(
    () => this.formService.report().categories.transport ?? 0,
  );

  readonly foodTotal = computed(
    () => this.formService.report().categories.food ?? 0,
  );

  readonly materialTotal = computed(
    () => this.formService.report().categories.material ?? 0,
  );

  readonly total = computed(
    () =>
      this.transportTotal() +
      this.materialTotal() +
      (this.foodEnabled() ? this.foodTotal() : 0),
  );
}
