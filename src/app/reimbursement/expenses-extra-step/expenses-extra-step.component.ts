import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ExpenseListComponent } from 'src/app/expenses/expense-list/expense-list.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { FoodExpenseCardComponent } from '../../expenses/food-expense-card/food-expense-card.component';
import { ReimbursementService } from '../shared/reimbursement.service';

@Component({
  selector: 'app-expenses-extra-step',
  templateUrl: './expenses-extra-step.component.html',
  styleUrls: ['./expenses-extra-step.component.css'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    FormCardComponent,
    ExpenseListComponent,
    FoodExpenseCardComponent
  ]
})
export class ExpensesExtraStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly controlService = inject(ReimbursementControlService);

  parentForm = this.controlService.expensesStep;
  foodForm = this.controlService.foodExpenses;
  materialForm = this.controlService.materialExpenses;

  report$ = this.controlService.reimbursement$.pipe(
    switchMap(reimbursement =>
      this.reimbursementService.getReport(reimbursement)
    )
  );

  get isFoodEnabled() {
    return this.controlService.foodSettings.controls.isEnabled;
  }
}
