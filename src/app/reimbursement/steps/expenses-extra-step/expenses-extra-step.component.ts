import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Button } from 'src/app/shared/ui/button';
import { ExpenseListComponent } from '../../expenses/expense-list/expense-list.component';
import { FoodExpenseCardComponent } from '../../expenses/food-expense-card/food-expense-card.component';
import { ReimbursementService } from '../../shared/reimbursement.service';

@Component({
  selector: 'app-expenses-extra-step',
  templateUrl: './expenses-extra-step.component.html',
  styleUrls: ['./expenses-extra-step.component.css'],
  imports: [
    Button,
    ReactiveFormsModule,
    CurrencyPipe,
    ExpenseListComponent,
    FoodExpenseCardComponent,
  ],
})
export class ExpensesExtraStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly controlService = inject(ReimbursementControlService);

  readonly showFood = input(true);

  parentForm = this.controlService.expensesStep;
  stepGuard = this.controlService.expensesExtraStepGuard;
  foodForm = this.controlService.foodExpenses;
  materialForm = this.controlService.materialExpenses;

  // expenses form changes (push/removeAt/enable/disable) go through Reactive
  // Forms, not signals, so mirror them into a signal — otherwise the totals
  // below wouldn't refresh under zoneless change detection
  private readonly expensesChanged = toSignal(this.parentForm.valueChanges, {
    initialValue: null,
  });

  private readonly report = computed(() => {
    this.expensesChanged();
    const reimbursment = this.controlService.getReimbursement();
    return this.reimbursementService.getReport(reimbursment);
  });

  get isFoodEnabled() {
    return this.controlService.foodSettings.controls.isEnabled;
  }

  readonly transportTotal = computed(
    () => this.report().categories.transport ?? 0,
  );

  readonly foodEnabled = computed(() => {
    this.expensesChanged();
    return this.foodForm.enabled;
  });

  readonly foodTotal = computed(() => this.report().categories.food ?? 0);

  readonly materialTotal = computed(
    () => this.report().categories.material ?? 0,
  );

  readonly total = computed(
    () =>
      this.transportTotal() +
      this.materialTotal() +
      (this.foodEnabled() ? this.foodTotal() : 0),
  );
}
